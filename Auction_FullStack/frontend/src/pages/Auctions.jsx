import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  NoSymbolIcon,
  Squares2X2Icon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const Auctions = () => {
  const { allAuctions = [], loading } = useSelector((state) => state.auction);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          (allAuctions || [])
            .map((a) => a?.category)
            .filter((c) => typeof c === "string" && c.length > 0),
        ),
      ).sort(),
    [allAuctions],
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm ||
      selectedCategory ||
      minPrice ||
      maxPrice ||
      sortBy !== "newest"
    );
  }, [searchTerm, selectedCategory, minPrice, maxPrice, sortBy]);

  const filteredAuctions = useMemo(() => {
    let filtered = (allAuctions || []).filter((auction) => {
      if (!auction) return false;

      const title = auction.title || "";
      const category = auction.category || "";
      const price = Number(auction.currentPrice ?? auction.startingPrice ?? 0);

      const matchesTitle = debouncedTerm
        ? title.toLowerCase().includes(debouncedTerm.toLowerCase())
        : true;

      const matchesCategory = selectedCategory
        ? category === selectedCategory
        : true;

      const matchesMin = minPrice !== "" ? price >= Number(minPrice) : true;
      const matchesMax = maxPrice !== "" ? price <= Number(maxPrice) : true;

      return matchesTitle && matchesCategory && matchesMin && matchesMax;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) =>
            (a.currentPrice || a.startingPrice) -
            (b.currentPrice || b.startingPrice),
        );
        break;

      case "price-high":
        filtered.sort(
          (a, b) =>
            (b.currentPrice || b.startingPrice) -
            (a.currentPrice || a.startingPrice),
        );
        break;

      case "ending-soon":
        filtered.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
        break;

      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || b.startTime) -
            new Date(a.createdAt || a.startTime),
        );
    }

    return filtered;
  }, [
    allAuctions,
    debouncedTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const priceStats = useMemo(() => {
    const prices = filteredAuctions.map((a) =>
      Number(a.currentPrice ?? a.startingPrice ?? 0),
    );

    return {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
      avg: prices.length
        ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
        : 0,
    };
  }, [filteredAuctions]);

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 sm:pt-24">
          {/* HEADER */}
          <div className="bg-white border-b border-gray-200 shadow-sm sticky top-14 md:top-20 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#d6482b] to-orange-500 bg-clip-text text-transparent">
                    Live Auctions
                  </h1>

                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {filteredAuctions.length} items available
                  </p>
                </div>

                {/* Stats */}
                <div className="flex gap-3 overflow-x-auto">
                  <div className="bg-orange-50 px-3 py-2 rounded-lg min-w-[80px]">
                    <span className="text-xs text-gray-600">Min</span>
                    <p className="text-sm font-semibold text-[#d6482b]">
                      ${priceStats.min}
                    </p>
                  </div>

                  <div className="bg-orange-50 px-3 py-2 rounded-lg min-w-[80px]">
                    <span className="text-xs text-gray-600">Avg</span>
                    <p className="text-sm font-semibold text-[#d6482b]">
                      ${priceStats.avg}
                    </p>
                  </div>

                  <div className="bg-orange-50 px-3 py-2 rounded-lg min-w-[80px]">
                    <span className="text-xs text-gray-600">Max</span>
                    <p className="text-sm font-semibold text-[#d6482b]">
                      ${priceStats.max}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12 md:pt-10 md:pb-16">
            {/* FILTER BAR */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-[#d6482b] focus:outline-none"
                  />

                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className={`p-2.5 border-2 rounded-lg ${
                    showMobileFilters || hasActiveFilters
                      ? "bg-[#d6482b] text-white border-[#d6482b]"
                      : "border-gray-200"
                  }`}
                >
                  <FunnelIcon className="w-5 h-5" />
                </button>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none border-2 border-gray-200 rounded-lg pl-3 pr-8 py-2.5 text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="ending-soon">Ending</option>
                    <option value="price-low">Low</option>
                    <option value="price-high">High</option>
                  </select>

                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                <div className="hidden sm:flex border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-[#d6482b] text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    <Squares2X2Icon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-[#d6482b] text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    <Bars3Icon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {showMobileFilters && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Min $"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg"
                  />

                  <input
                    type="number"
                    placeholder="Max $"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* RESULTS */}

            {filteredAuctions.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
                <NoSymbolIcon className="w-16 h-16 mx-auto text-gray-400 mb-6" />
                <h3 className="text-2xl font-bold mb-3">No Auctions Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters</p>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="bg-[#d6482b] text-white px-6 py-3 rounded-lg"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "flex flex-col gap-4"
                }
              >
                {filteredAuctions.map((auction) => (
                  <div
                    key={auction._id}
                    className={`${viewMode === "list" ? "w-full" : ""} flex`}
                  >
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
                      viewMode={viewMode}
                      compact={true}
                    />
                  </div>
                ))}
              </div>
            )}

            {filteredAuctions.length >= 12 && (
              <div className="flex justify-center pt-10">
                <button className="px-6 py-3 bg-white border-2 border-[#d6482b] text-[#d6482b] rounded-lg font-semibold hover:bg-[#d6482b] hover:text-white transition-colors">
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Auctions;
