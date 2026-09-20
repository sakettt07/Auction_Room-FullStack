import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  Fragment,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getAllAuctionItems } from "@/store/slices/auctionSlice";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  Bars3Icon,
  SparklesIcon,
  TagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  FireIcon,
  ArrowPathIcon,
  NoSymbolIcon,
  CheckBadgeIcon,
  CheckIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

const Auctions = () => {
  const dispatch = useDispatch();
  const { allAuctions = [], loading } = useSelector((state) => state.auction);
  const [cachedAuctions, setCachedAuctions] = useState([]);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'live', 'upcoming', 'ended'
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterTrayOpen, setIsFilterTrayOpen] = useState(false);

  // Custom Sort Dropdown State & Ref
  const sortDropdownRef = useRef(null);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const SORT_OPTIONS = [
    { id: "newest", label: "Newest Listed First", icon: SparklesIcon },
    { id: "ending-soon", label: "Ending Soonest", icon: ClockIcon },
    { id: "price-low", label: "Price: Low to High", icon: CurrencyDollarIcon },
    { id: "price-high", label: "Price: High to Low", icon: CurrencyDollarIcon },
    { id: "most-bids", label: "Most Bids Placed", icon: FireIcon },
  ];

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label || "Newest Listed First";

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load cached auctions instantly on mount
  useEffect(() => {
    const cached = localStorage.getItem("auctions_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCachedAuctions(parsed.data || []);
      } catch (e) {
        console.error("Failed to parse cached auctions", e);
      }
    }
    dispatch(getAllAuctionItems());
  }, [dispatch]);

  const displayAuctions = allAuctions.length > 0 ? allAuctions : cachedAuctions;

  // Debounce search term for smooth performance
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 250);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Extract dynamic categories from active listings
  const categories = useMemo(() => {
    const set = new Set();
    (displayAuctions || []).forEach((item) => {
      if (item?.category && typeof item.category === "string" && item.category.trim()) {
        set.add(item.category.trim());
      }
    });
    return ["All", ...Array.from(set).sort()];
  }, [displayAuctions]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setDebouncedTerm("");
    setSelectedCategory("All");
    setStatusFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  }, []);

  // Quick price presets
  const applyPricePreset = (min, max) => {
    setMinPrice(min !== null ? String(min) : "");
    setMaxPrice(max !== null ? String(max) : "");
  };

  // Filter & Sort Logic
  const filteredAuctions = useMemo(() => {
    const now = new Date();

    let result = (displayAuctions || []).filter((auction) => {
      if (!auction) return false;

      const title = auction.title || "";
      const description = auction.description || "";
      const category = auction.category || "";
      const price = Number(auction.currentPrice ?? auction.startingPrice ?? 0);

      // Search match
      const matchesSearch = debouncedTerm
        ? title.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          description.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          category.toLowerCase().includes(debouncedTerm.toLowerCase())
        : true;

      // Category match
      const matchesCategory =
        selectedCategory === "All" ||
        (category && category.toLowerCase() === selectedCategory.toLowerCase());

      // Price match
      const matchesMin = minPrice !== "" ? price >= Number(minPrice) : true;
      const matchesMax = maxPrice !== "" ? price <= Number(maxPrice) : true;

      // Status match
      let matchesStatus = true;
      const start = auction.startTime ? new Date(auction.startTime) : null;
      const end = auction.endTime ? new Date(auction.endTime) : null;

      if (statusFilter === "live") {
        matchesStatus = start && end ? now >= start && now <= end : false;
      } else if (statusFilter === "upcoming") {
        matchesStatus = start ? now < start : false;
      } else if (statusFilter === "ended") {
        matchesStatus = end ? now > end : false;
      }

      return matchesSearch && matchesCategory && matchesMin && matchesMax && matchesStatus;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) =>
            (a.currentPrice || a.startingPrice || 0) -
            (b.currentPrice || b.startingPrice || 0)
        );
        break;
      case "price-high":
        result.sort(
          (a, b) =>
            (b.currentPrice || b.startingPrice || 0) -
            (a.currentPrice || a.startingPrice || 0)
        );
        break;
      case "ending-soon":
        result.sort((a, b) => new Date(a.endTime || 0) - new Date(b.endTime || 0));
        break;
      case "most-bids":
        result.sort((a, b) => (b.bids?.length || 0) - (a.bids?.length || 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => {
          const timeA = a.createdAt
            ? new Date(a.createdAt).getTime()
            : a._id
            ? parseInt(a._id.substring(0, 8), 16) * 1000
            : 0;
          const timeB = b.createdAt
            ? new Date(b.createdAt).getTime()
            : b._id
            ? parseInt(b._id.substring(0, 8), 16) * 1000
            : 0;
          return timeB - timeA;
        });
        break;
    }

    return result;
  }, [displayAuctions, debouncedTerm, selectedCategory, statusFilter, minPrice, maxPrice, sortBy]);

  // Price Stats for Top Metrics
  const priceStats = useMemo(() => {
    const prices = filteredAuctions.map((a) =>
      Number(a.currentPrice ?? a.startingPrice ?? 0)
    );
    return {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
      avg: prices.length
        ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        : 0,
    };
  }, [filteredAuctions]);

  // Active filter counter
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (statusFilter !== "all") count++;
    if (minPrice !== "") count++;
    if (maxPrice !== "") count++;
    if (searchTerm.trim() !== "") count++;
    if (sortBy !== "newest") count++;
    return count;
  }, [selectedCategory, statusFilter, minPrice, maxPrice, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50/70 via-white to-stone-50/50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 flex flex-col gap-8">
        
        {/* 1. HEADER SECTION (Clean, wide, modern) */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#D6482B] border border-orange-200/60 mb-2.5">
              <SparklesIcon className="w-3.5 h-3.5" />
              Live Marketplace • Authenticated Lots
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              Live & Upcoming{" "}
              <span className="bg-gradient-to-r from-[#D6482B] via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Auctions
              </span>
            </h1>

            <p className="text-stone-500 text-sm sm:text-base mt-1.5 max-w-2xl">
              Bid in real-time on rare collectibles, luxury timepieces, fine art, and premium lots with guaranteed escrow protection.
            </p>
          </div>

          {/* Quick Metrics Pills Bar */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-sm flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckBadgeIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                  Available Lots
                </p>
                <p className="text-base font-black text-stone-900">
                  {filteredAuctions.length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-sm flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#D6482B] flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                  Average Price
                </p>
                <p className="text-base font-black text-[#D6482B]">
                  ₹{priceStats.avg.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-sm flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                  Top Lot
                </p>
                <p className="text-base font-black text-stone-900">
                  ₹{priceStats.max.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. COMMAND SEARCH & FILTER CONTROL BAR */}
        <section className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-3.5 sm:p-4 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input Bar */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search auctions by title, category, keywords..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-stone-200 bg-stone-50/70 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#D6482B] focus:ring-4 focus:ring-orange-500/10 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Controls Right Group */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              
              {/* Filter Toggle Button with Badge */}
              <button
                onClick={() => setIsFilterTrayOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition shadow-sm ${
                  isFilterTrayOpen || activeFilterCount > 0
                    ? "bg-orange-50 border-orange-300 text-[#D6482B]"
                    : "bg-white border-stone-200 text-stone-700 hover:border-orange-300 hover:text-stone-900"
                }`}
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#D6482B] text-white text-[11px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Custom Luxury Sort Dropdown */}
              <div className="relative flex-1 sm:flex-initial" ref={sortDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className={`w-full sm:w-auto px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-sm transition-all ${
                    isSortOpen
                      ? "border-[#D6482B] bg-orange-50/40 text-[#D6482B] ring-2 ring-[#D6482B]/10"
                      : "border-stone-200 bg-white text-stone-700 hover:border-orange-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ArrowsUpDownIcon className="w-4 h-4 text-stone-400" />
                    <span>{currentSortLabel}</span>
                  </div>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                      isSortOpen ? "rotate-180 text-[#D6482B]" : ""
                    }`}
                  />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 rounded-2xl bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1">
                      Sort Auctions By
                    </div>
                    <div className="space-y-0.5">
                      {SORT_OPTIONS.map((opt) => {
                        const isSelected = sortBy === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setSortBy(opt.id);
                              setIsSortOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                              isSelected
                                ? "bg-orange-50 text-[#D6482B] font-bold"
                                : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <opt.icon
                                className={`w-4 h-4 ${
                                  isSelected ? "text-[#D6482B]" : "text-stone-400"
                                }`}
                              />
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && (
                              <CheckIcon className="w-4 h-4 text-[#D6482B]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center border border-stone-200 p-1 rounded-2xl bg-stone-50 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition ${
                    viewMode === "grid"
                      ? "bg-white text-[#D6482B] shadow-sm font-bold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                  aria-label="Grid layout"
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition ${
                    viewMode === "list"
                      ? "bg-white text-[#D6482B] shadow-sm font-bold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                  aria-label="List layout"
                >
                  <Bars3Icon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Category Scroll Bar */}
          <div className="pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 pl-1 pr-2 flex items-center gap-1 flex-shrink-0">
              <TagIcon className="w-3.5 h-3.5" />
              Categories:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#D6482B] text-white shadow-sm"
                    : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 3. EXPANDABLE FILTER TRAY */}
          {isFilterTrayOpen && (
            <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
              
              {/* Status Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Auction Status
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1 rounded-xl">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                      statusFilter === "all"
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter("live")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                      statusFilter === "live"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </button>
                  <button
                    onClick={() => setStatusFilter("upcoming")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                      statusFilter === "upcoming"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    Upcoming
                  </button>
                </div>
              </div>

              {/* Price Range (Min & Max) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Price Filter (₹)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min (₹)"
                    min="0"
                    className="w-1/2 px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                  />
                  <span className="text-stone-400 font-bold">-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max (₹)"
                    min="0"
                    className="w-1/2 px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                  />
                </div>

                {/* Quick presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => applyPricePreset(0, 10000)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                  >
                    Under ₹10k
                  </button>
                  <button
                    onClick={() => applyPricePreset(10000, 50000)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                  >
                    ₹10k - ₹50k
                  </button>
                  <button
                    onClick={() => applyPricePreset(50000, 200000)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                  >
                    ₹50k - ₹2L
                  </button>
                  <button
                    onClick={() => applyPricePreset(200000, null)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                  >
                    ₹2L+
                  </button>
                </div>
              </div>

              {/* Reset Actions */}
              <div className="flex items-end justify-start lg:justify-end">
                <button
                  onClick={clearFilters}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100 transition flex items-center justify-center gap-1.5"
                >
                  <ArrowPathIcon className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>

            </div>
          )}

          {/* Active Filter Chips Bar */}
          {activeFilterCount > 0 && (
            <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                Active ({activeFilterCount}):
              </span>

              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-semibold">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}>
                    <XMarkIcon className="w-3 h-3 text-stone-500 hover:text-[#D6482B]" />
                  </button>
                </span>
              )}

              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-[#D6482B] border border-orange-200/60 font-semibold">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("All")}>
                    <XMarkIcon className="w-3 h-3 text-[#D6482B]" />
                  </button>
                </span>
              )}

              {statusFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold capitalize">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter("all")}>
                    <XMarkIcon className="w-3 h-3 text-blue-700" />
                  </button>
                </span>
              )}

              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-semibold">
                  Price: ₹{minPrice || "0"} - ₹{maxPrice || "Any"}
                  <button onClick={() => { setMinPrice(""); setMaxPrice(""); }}>
                    <XMarkIcon className="w-3 h-3 text-stone-500 hover:text-[#D6482B]" />
                  </button>
                </span>
              )}

              <button
                onClick={clearFilters}
                className="text-xs font-bold text-[#D6482B] hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* 4. RESULTS SECTION (Full width, zero wasted space) */}
        <section>
          {loading && displayAuctions.length === 0 ? (
            <div className="py-24 flex items-center justify-center">
              <Spinner />
            </div>
          ) : filteredAuctions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#D6482B] flex items-center justify-center mb-4">
                <NoSymbolIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mb-2">
                No Matching Auctions Found
              </h3>
              <p className="text-stone-500 text-sm mb-6 max-w-sm">
                We couldn't find any items matching your active search terms and filters.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
                >
                  Clear All Filters
                </button>
                <Link
                  to="/create-auction"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#D6482B] text-white hover:bg-[#b33a22] shadow-sm transition"
                >
                  List An Auction
                </Link>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* Full-width 4-column responsive grid - No dead space! */
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAuctions.map((auction) => (
                <div key={auction._id} className="h-full flex">
                  <Card
                    id={auction._id}
                    title={auction.title}
                    description={auction.description}
                    startTime={auction.startTime}
                    endTime={auction.endTime}
                    imgSrc={auction.itemImage?.url}
                    startingBid={auction.startingPrice}
                    currentBid={auction.currentPrice}
                    bids={auction.bids}
                    category={auction.category}
                    condition={auction.condition}
                    viewMode="grid"
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Wide luxury list view */
            <div className="flex flex-col gap-4">
              {filteredAuctions.map((auction) => (
                <div key={auction._id} className="w-full">
                  <Card
                    id={auction._id}
                    title={auction.title}
                    description={auction.description}
                    startTime={auction.startTime}
                    endTime={auction.endTime}
                    imgSrc={auction.itemImage?.url}
                    startingBid={auction.startingPrice}
                    currentBid={auction.currentPrice}
                    bids={auction.bids}
                    category={auction.category}
                    condition={auction.condition}
                    viewMode="list"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Auctions;
