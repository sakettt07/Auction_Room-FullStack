import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  getMyAuctionItems,
  deleteAuction,
  republishAuction,
} from "@/store/slices/auctionSlice";
import Spinner from "@/custom-components/Spinner";
import { toast } from "react-toastify";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  Squares2X2Icon,
  Bars3Icon,
  SparklesIcon,
  FireIcon,
  CalendarIcon,
  ClockIcon,
  TrophyIcon,
  CurrencyRupeeIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  UserIcon,
  TagIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const ViewMyAuctions = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const { myAuctions = [], loading } = useSelector((state) => state.auction);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [cachedAuctions, setCachedAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Custom Sort Dropdown State
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Republish Modal State
  const [republishItemData, setRepublishItemData] = useState(null);
  const [republishForm, setRepublishForm] = useState({
    startTime: "",
    endTime: "",
  });
  const [isRepublishing, setIsRepublishing] = useState(false);

  // Delete Confirmation Modal State
  const [deleteItemData, setDeleteItemData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load from local storage cache initially
  useEffect(() => {
    const cached = localStorage.getItem("my_auctions_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.data && Array.isArray(parsed.data)) {
          setCachedAuctions(parsed.data);
        }
      } catch (err) {
        console.error("Failed to parse cached auctions", err);
      }
    }
  }, []);

  // Update local cache when fresh myAuctions arrive
  useEffect(() => {
    if (myAuctions && myAuctions.length > 0) {
      localStorage.setItem(
        "my_auctions_cache",
        JSON.stringify({
          data: myAuctions,
          time: Date.now(),
        })
      );
    }
  }, [myAuctions]);

  // Auth & role protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/login");
      return;
    }
    if (user && user.role !== "Auctioneer") {
      toast.error("Auctioneer console is reserved for registered Auctioneer accounts.");
      navigateTo("/");
      return;
    }
    dispatch(getMyAuctionItems());
  }, [dispatch, navigateTo, isAuthenticated, user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const displayAuctions = myAuctions.length > 0 ? myAuctions : cachedAuctions;

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getMyAuctionItems());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Compute KPI Statistics
  const stats = useMemo(() => {
    const now = new Date();
    let active = 0;
    let upcoming = 0;
    let ended = 0;
    let soldItems = 0;
    let totalBids = 0;
    let totalRevenue = 0;

    displayAuctions.forEach((auction) => {
      const start = new Date(auction.startTime);
      const end = new Date(auction.endTime);
      const bidsCount = auction.bids?.length || 0;
      totalBids += bidsCount;

      if (now < start) {
        upcoming++;
      } else if (now <= end) {
        active++;
      } else {
        ended++;
        if (bidsCount > 0) {
          soldItems++;
          totalRevenue += Number(auction.currentPrice || auction.startingPrice || 0);
        }
      }
    });

    const sellThroughRate =
      ended > 0 ? Math.round((soldItems / ended) * 100) : 0;

    return {
      total: displayAuctions.length,
      active,
      upcoming,
      ended,
      soldItems,
      unsoldItems: ended - soldItems,
      totalBids,
      totalRevenue,
      sellThroughRate,
    };
  }, [displayAuctions]);

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const set = new Set();
    displayAuctions.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ["all", ...Array.from(set)];
  }, [displayAuctions]);

  // Filter and Sort Auctions
  const filteredAndSortedAuctions = useMemo(() => {
    const now = new Date();

    return displayAuctions
      .filter((auction) => {
        const start = new Date(auction.startTime);
        const end = new Date(auction.endTime);
        const bidsCount = auction.bids?.length || 0;

        // Status Filter
        if (selectedStatus === "active") {
          if (!(now >= start && now <= end)) return false;
        } else if (selectedStatus === "upcoming") {
          if (!(now < start)) return false;
        } else if (selectedStatus === "sold") {
          if (!(now > end && bidsCount > 0)) return false;
        } else if (selectedStatus === "unsold") {
          if (!(now > end && bidsCount === 0)) return false;
        } else if (selectedStatus === "ended") {
          if (!(now > end)) return false;
        }

        // Category Filter
        if (selectedCategory !== "all" && auction.category !== selectedCategory) {
          return false;
        }

        // Search Term Filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const titleMatch = auction.title?.toLowerCase().includes(query);
          const descMatch = auction.description?.toLowerCase().includes(query);
          const catMatch = auction.category?.toLowerCase().includes(query);
          if (!titleMatch && !descMatch && !catMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || b.startTime) - new Date(a.createdAt || a.startTime);
        }
        if (sortBy === "ending-soon") {
          return new Date(a.endTime) - new Date(b.endTime);
        }
        if (sortBy === "price-high") {
          const priceA = a.currentPrice || a.startingPrice || 0;
          const priceB = b.currentPrice || b.startingPrice || 0;
          return priceB - priceA;
        }
        if (sortBy === "price-low") {
          const priceA = a.currentPrice || a.startingPrice || 0;
          const priceB = b.currentPrice || b.startingPrice || 0;
          return priceA - priceB;
        }
        if (sortBy === "most-bids") {
          return (b.bids?.length || 0) - (a.bids?.length || 0);
        }
        return 0;
      });
  }, [displayAuctions, selectedStatus, selectedCategory, searchTerm, sortBy]);

  // Sort Options Config
  const SORT_OPTIONS = [
    { id: "newest", label: "Newest Listed First" },
    { id: "ending-soon", label: "Ending Soonest" },
    { id: "price-high", label: "Highest Bid / Price" },
    { id: "price-low", label: "Lowest Starting Price" },
    { id: "most-bids", label: "Most Bids Attracted" },
  ];

  // Open Republish Modal
  const openRepublishModal = (auction) => {
    setRepublishItemData(auction);
    // Suggest default times (starting in 10 minutes, ending 24 hours later)
    const defaultStart = new Date(Date.now() + 10 * 60 * 1000);
    const defaultEnd = new Date(Date.now() + 24 * 60 * 60 * 1000 + 10 * 60 * 1000);

    const toLocalISO = (d) => {
      const offset = d.getTimezoneOffset() * 60000;
      return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    };

    setRepublishForm({
      startTime: toLocalISO(defaultStart),
      endTime: toLocalISO(defaultEnd),
    });
  };

  // Submit Republish
  const handleRepublishSubmit = async (e) => {
    e.preventDefault();
    if (!republishForm.startTime || !republishForm.endTime) {
      toast.error("Please provide both start time and end time");
      return;
    }

    const start = new Date(republishForm.startTime);
    const end = new Date(republishForm.endTime);
    const now = new Date();

    if (start <= now) {
      toast.error("Start time must be in the future");
      return;
    }
    if (end <= start) {
      toast.error("End time must be after the start time");
      return;
    }

    setIsRepublishing(true);
    try {
      await dispatch(
        republishAuction(republishItemData._id, {
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        })
      );
      setRepublishItemData(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRepublishing(false);
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!deleteItemData) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteAuction(deleteItemData._id));
      setDeleteItemData(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // Helper to format remaining / scheduled time
  const getTimeBadge = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return {
        label: "Upcoming",
        colorClass: "bg-amber-100 text-amber-800 border-amber-200",
        detail: `Starts ${start.toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`,
      };
    }
    if (now <= end) {
      return {
        label: "Live Now",
        colorClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        detail: `Ends ${end.toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`,
      };
    }
    return {
      label: "Concluded",
      colorClass: "bg-stone-100 text-stone-700 border-stone-200",
      detail: `Ended ${end.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`,
    };
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 pt-6 sm:pt-8 pb-20 selection:bg-[#D6482B]/10 selection:text-[#D6482B]">
      {/* BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-[#D6482B]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            1. HERO CONSOLE HEADER
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#D6482B] border border-orange-200/60 mb-2.5">
              <SparklesIcon className="w-3.5 h-3.5" />
              Certified Auctioneer Console
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              My Curated{" "}
              <span className="bg-gradient-to-r from-[#D6482B] via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Auctions
              </span>
            </h1>
            <p className="text-stone-500 text-sm sm:text-base mt-1.5 max-w-2xl">
              Supervise active bidding sessions, inspect collector engagement, and manage listing schedules with institutional fidelity.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 hover:border-stone-300 transition shadow-sm disabled:opacity-50 cursor-pointer"
              title="Refresh listings"
            >
              <ArrowPathIcon
                className={`w-4 h-4 text-stone-500 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to="/create-auction"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D6482B] hover:bg-[#b83b22] text-white text-xs font-bold shadow-lg shadow-[#D6482B]/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <PlusIcon className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Auction</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            2. AUCTIONEER KPI INTELLIGENCE CARDS
           ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-8">
          {/* Active Live */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Live Now
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-2xl sm:text-3xl font-black text-stone-900">
                {stats.active}
              </p>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                Active
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Accepting collector bids</p>
          </div>

          {/* Upcoming Scheduled */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Upcoming
              </span>
              <CalendarIcon className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-2xl sm:text-3xl font-black text-stone-900">
                {stats.upcoming}
              </p>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                Scheduled
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Ready for launch</p>
          </div>

          {/* Sold & Settled */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-sm relative overflow-hidden group hover:border-purple-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Sold Lots
              </span>
              <TrophyIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-2xl sm:text-3xl font-black text-purple-950">
                {stats.soldItems}
              </p>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md">
                {stats.sellThroughRate}% Rate
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Hammered & settled</p>
          </div>

          {/* Total Bids Attracted */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Total Bids
              </span>
              <FireIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-2xl sm:text-3xl font-black text-stone-900">
                {stats.totalBids}
              </p>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md">
                Actions
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Across all listings</p>
          </div>

          {/* Gross Realized Revenue */}
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl p-4 sm:p-5 border border-stone-800 shadow-md relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Gross Volume
              </span>
              <CurrencyRupeeIcon className="w-4 h-4 text-[#D6482B]" />
            </div>
            <div className="mt-2">
              <p className="text-xl sm:text-2xl font-black text-white truncate">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Realized auction value</p>
          </div>
        </div>

        {/* =========================================================================
            3. CONTROL BAR: SEARCH, STATUS PILLS, SORT & VIEW MODES
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <MagnifyingGlassIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your lots by title, description or category..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition placeholder:text-stone-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls Right Dock */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              {categories.length > 2 && (
                <div className="flex items-center gap-1.5">
                  <TagIcon className="w-4 h-4 text-stone-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories
                      .filter((c) => c !== "all")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Sort Selector Dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                >
                  <span className="text-stone-400 font-normal">Sort:</span>
                  <span>
                    {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                  </span>
                  <ChevronDownIcon
                    className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                          sortBy === opt.id
                            ? "bg-orange-50 text-[#D6482B] font-bold"
                            : "text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D6482B]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-[#D6482B] shadow-sm font-bold"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                  title="Gallery Grid View"
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white text-[#D6482B] shadow-sm font-bold"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                  title="Lot Table View"
                >
                  <Bars3Icon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-stone-100">
            {[
              { id: "all", label: "All Lots", count: stats.total },
              { id: "active", label: "Live Now", count: stats.active, dot: "bg-emerald-500" },
              { id: "upcoming", label: "Upcoming", count: stats.upcoming, dot: "bg-amber-500" },
              { id: "sold", label: "Sold / Settled", count: stats.soldItems, dot: "bg-purple-600" },
              { id: "unsold", label: "Unsold", count: stats.unsoldItems, dot: "bg-stone-400" },
              { id: "ended", label: "All Ended", count: stats.ended },
            ].map((tab) => {
              const isSelected = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/70"
                  }`}
                >
                  {tab.dot && (
                    <span className={`w-2 h-2 rounded-full ${tab.dot}`} />
                  )}
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-stone-200/80 text-stone-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            4. AUCTIONS LISTING (GRID OR LIST VIEW)
           ========================================================================= */}
        {loading && displayAuctions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-stone-200/80 shadow-sm">
            <Spinner />
            <p className="text-xs font-bold text-stone-400 tracking-wider uppercase mt-4">
              Loading Auction Lots...
            </p>
          </div>
        ) : filteredAndSortedAuctions.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-12 text-center max-w-xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#D6482B] flex items-center justify-center mx-auto mb-4 border border-orange-100">
              <SparklesIcon className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-stone-900">
              {displayAuctions.length === 0
                ? "No Auctions Created Yet"
                : "No Lots Match Current Filters"}
            </h3>

            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
              {displayAuctions.length === 0
                ? "You haven't listed any auctions yet. Start curating your catalogue to launch live bidding sessions on the platform."
                : "Try selecting another status tab, clearing your search query, or resetting filters to inspect your catalogue."}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              {displayAuctions.length === 0 ? (
                <Link
                  to="/create-auction"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#D6482B] hover:bg-[#b83b22] text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Create Your First Auction</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setSelectedStatus("all");
                    setSelectedCategory("all");
                    setSearchTerm("");
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* =========================================================================
              GRID VIEW
             ========================================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAndSortedAuctions.map((auction) => {
              const now = new Date();
              const start = new Date(auction.startTime);
              const end = new Date(auction.endTime);
              const isLive = now >= start && now <= end;
              const isUpcoming = now < start;
              const isEnded = now > end;
              const totalBids = auction.bids?.length || 0;
              const hasWinner = isEnded && totalBids > 0 && auction.highestBidder;

              const timeBadge = getTimeBadge(auction.startTime, auction.endTime);

              return (
                <div
                  key={auction._id}
                  className="bg-white rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="relative h-52 bg-stone-100 overflow-hidden">
                    <img
                      src={auction.itemImage?.url || "/placeholder_image.jpg"}
                      alt={auction.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Status Pill Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md border ${timeBadge.colorClass}`}
                      >
                        {isLive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                        )}
                        <span>{timeBadge.label}</span>
                      </span>
                    </div>

                    {/* Category Tag */}
                    {auction.category && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-stone-800 shadow-sm">
                          {auction.category}
                        </span>
                      </div>
                    )}

                    {/* Condition Pill */}
                    {auction.condition && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                          {auction.condition} Condition
                        </span>
                      </div>
                    )}

                    {/* Bids Count Pill */}
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D6482B] text-white shadow-sm flex items-center gap-1">
                        <FireIcon className="w-3 h-3" />
                        <span>{totalBids} {totalBids === 1 ? "bid" : "bids"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base line-clamp-1 group-hover:text-[#D6482B] transition-colors">
                        {auction.title}
                      </h3>

                      <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                        {auction.description || "Authentic verified catalog lot."}
                      </p>

                      {/* Pricing Details */}
                      <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-400 font-medium">
                            {isUpcoming
                              ? "Starting Price"
                              : isLive
                              ? "Current High Bid"
                              : totalBids > 0
                              ? "Realized Hammer"
                              : "Starting Price"}
                          </span>
                          <span
                            className={`font-black text-sm ${
                              isLive
                                ? "text-emerald-700"
                                : isEnded && totalBids > 0
                                ? "text-[#D6482B]"
                                : "text-stone-900"
                            }`}
                          >
                            {formatCurrency(
                              auction.currentPrice || auction.startingPrice
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-400">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            <span>{timeBadge.detail}</span>
                          </span>
                        </div>
                      </div>

                      {/* Winner Highlight (if ended & sold) */}
                      {hasWinner && (
                        <div className="mt-2.5 p-2 rounded-xl bg-purple-50/80 border border-purple-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <TrophyIcon className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />
                            <span className="text-[11px] text-purple-900 font-bold truncate max-w-[120px]">
                              Winner Assigned
                            </span>
                          </div>
                          <span className="text-[11px] font-black text-purple-900">
                            {formatCurrency(auction.currentPrice)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <Link
                        to={`/auction/item/${auction._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition cursor-pointer"
                      >
                        <EyeIcon className="w-3.5 h-3.5 text-stone-500" />
                        <span>View Lot</span>
                      </Link>

                      {isEnded && (
                        <button
                          type="button"
                          onClick={() => openRepublishModal(auction)}
                          className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#D6482B] border border-orange-200/60 transition cursor-pointer"
                          title="Republish with new schedule"
                        >
                          <ArrowPathIcon className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setDeleteItemData(auction)}
                        className="p-2 rounded-xl bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-600 border border-stone-200 transition cursor-pointer"
                        title="Delete listing"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* =========================================================================
              LIST VIEW (AUCTIONEER LOT TABLE)
             ========================================================================= */
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200/80 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Lot Item</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Current Price</th>
                    <th className="py-3.5 px-4">Total Bids</th>
                    <th className="py-3.5 px-4">Timeline</th>
                    <th className="py-3.5 px-4 text-right pr-6">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredAndSortedAuctions.map((auction) => {
                    const now = new Date();
                    const start = new Date(auction.startTime);
                    const end = new Date(auction.endTime);
                    const isLive = now >= start && now <= end;
                    const isUpcoming = now < start;
                    const isEnded = now > end;
                    const totalBids = auction.bids?.length || 0;
                    const timeBadge = getTimeBadge(auction.startTime, auction.endTime);

                    return (
                      <tr
                        key={auction._id}
                        className="hover:bg-stone-50/70 transition-colors group"
                      >
                        {/* Lot & Image */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={auction.itemImage?.url || "/placeholder_image.jpg"}
                              alt={auction.title}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-stone-900 truncate group-hover:text-[#D6482B] transition-colors">
                                {auction.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {auction.category && (
                                  <span className="text-[10px] text-stone-500 font-medium">
                                    {auction.category}
                                  </span>
                                )}
                                {auction.condition && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                                    {auction.condition}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${timeBadge.colorClass}`}
                          >
                            {isLive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                            )}
                            <span>{timeBadge.label}</span>
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-stone-900 text-sm">
                            {formatCurrency(
                              auction.currentPrice || auction.startingPrice
                            )}
                          </span>
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            Start: {formatCurrency(auction.startingPrice)}
                          </p>
                        </td>

                        {/* Bids */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-bold">
                              {totalBids}
                            </span>
                            <span className="text-[11px] text-stone-400">
                              {totalBids === 1 ? "bid" : "bids"}
                            </span>
                          </div>
                        </td>

                        {/* Timeline */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 text-[11px]">
                          <div className="flex items-center gap-1 text-stone-600 font-medium">
                            <ClockIcon className="w-3.5 h-3.5 text-stone-400" />
                            <span>{timeBadge.detail}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              to={`/auction/item/${auction._id}`}
                              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                              title="View auction details"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Link>

                            {isEnded && (
                              <button
                                type="button"
                                onClick={() => openRepublishModal(auction)}
                                className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#D6482B] transition cursor-pointer"
                                title="Republish lot"
                              >
                                <ArrowPathIcon className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setDeleteItemData(auction)}
                              className="p-2 rounded-xl bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-600 transition cursor-pointer"
                              title="Delete listing"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Counter Footer */}
        {filteredAndSortedAuctions.length > 0 && (
          <div className="mt-6 text-center text-xs text-stone-400">
            Displaying {filteredAndSortedAuctions.length} of {displayAuctions.length} auction lots in your catalog.
          </div>
        )}
      </div>

      {/* =========================================================================
          5. REPUBLISH AUCTION MODAL
         ========================================================================= */}
      {republishItemData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center">
                  <ArrowPathIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Republish Auction Lot
                  </h3>
                  <p className="text-xs text-stone-500">
                    Reset bids and schedule a new bidding window
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRepublishItemData(null)}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center transition cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Target Item Thumbnail */}
            <div className="p-6 pb-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <img
                  src={republishItemData.itemImage?.url || "/placeholder_image.jpg"}
                  alt={republishItemData.title}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-stone-900 truncate">
                    {republishItemData.title}
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Starting Bid: {formatCurrency(republishItemData.startingPrice)}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRepublishSubmit} className="p-6 pt-3 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  New Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={republishForm.startTime}
                  onChange={(e) =>
                    setRepublishForm({
                      ...republishForm,
                      startTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Must be scheduled in the future.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  New Concluding Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={republishForm.endTime}
                  onChange={(e) =>
                    setRepublishForm({
                      ...republishForm,
                      endTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Must be set after the new start date and time.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setRepublishItemData(null)}
                  disabled={isRepublishing}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRepublishing}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#D6482B] text-white hover:bg-[#b83b22] transition shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isRepublishing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <span>Republish Auction</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. DELETE CONFIRMATION MODAL
         ========================================================================= */}
      {deleteItemData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <ExclamationTriangleIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Delete Auction Listing?
                </h3>
                <p className="text-xs text-stone-500">
                  This lot will be permanently removed from the catalogue.
                </p>
              </div>
            </div>

            {/* Auction preview */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3 my-4">
              <img
                src={deleteItemData.itemImage?.url || "/placeholder_image.jpg"}
                alt={deleteItemData.title}
                className="w-12 h-12 rounded-xl object-cover border border-stone-200"
              />
              <div className="min-w-0">
                <p className="font-bold text-xs text-stone-900 truncate">
                  {deleteItemData.title}
                </p>
                <p className="text-[11px] text-stone-400">
                  {deleteItemData.bids?.length || 0} bids placed
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Are you sure you wish to delete this auction? All active bids and transaction history linked with this listing will be wiped.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeleteItemData(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Listing</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMyAuctions;
