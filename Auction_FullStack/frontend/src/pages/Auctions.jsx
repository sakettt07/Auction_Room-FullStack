import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  Fragment,
} from "react";
import { useSelector } from "react-redux";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  NoSymbolIcon,
  Squares2X2Icon,
  Bars3Icon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";

const Auctions = () => {
  const { allAuctions = [], loading } = useSelector((state) => state.auction);
  const [cachedAuctions, setCachedAuctions] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem("auctions_cache");
    if (cached) {
      const parsed = JSON.parse(cached);
      setCachedAuctions(parsed.data || []);
    }
  }, []);
  const displayAuctions = allAuctions.length > 0 ? allAuctions : cachedAuctions;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          (displayAuctions || [])
            .map((a) => a?.category)
            .filter((c) => typeof c === "string" && c.length > 0),
        ),
      ).sort(),
    [displayAuctions],
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setTempFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
    });
  }, []);

  const applyMobileFilters = () => {
    setSelectedCategory(tempFilters.category);
    setMinPrice(tempFilters.minPrice);
    setMaxPrice(tempFilters.maxPrice);
    setIsFilterSidebarOpen(false);
  };

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
    let filtered = (displayAuctions || []).filter((auction) => {
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

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (minPrice) count++;
    if (maxPrice) count++;
    if (searchTerm) count++;
    if (sortBy !== "newest") count++;
    return count;
  }, [selectedCategory, minPrice, maxPrice, searchTerm, sortBy]);

  return (
    <>
      {loading && displayAuctions.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 sm:pt-24">
          {/* HEADER */}
          <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-[#d6482b] to-orange-500 bg-clip-text text-transparent">
                    Live Auctions
                  </h1>

                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {filteredAuctions.length} items available
                  </p>
                </div>

                {/* Stats */}
                <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
                  <div className="bg-orange-50 px-3 py-2 rounded-lg min-w-[70px] flex-shrink-0">
                    <span className="text-xs text-gray-600">Min</span>
                    <p className="text-sm font-semibold text-[#d6482b] whitespace-nowrap">
                      ₹{priceStats.min}
                    </p>
                  </div>

                  <div className="bg-orange-50 px-3 py-2 rounded-lg min-w-[70px] flex-shrink-0">
                    <span className="text-xs text-gray-600">Avg</span>
                    <p className="text-sm font-semibold text-[#d6482b] whitespace-nowrap">
                      ₹{priceStats.avg}
                    </p>
                  </div>

                  <div className="bg-orange-50 px-3 py-2 rounded-lg min-w-[70px] flex-shrink-0">
                    <span className="text-xs text-gray-600">Max</span>
                    <p className="text-sm font-semibold text-[#d6482b] whitespace-nowrap">
                      ₹{priceStats.max}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12 md:pt-10 md:pb-16">
            {/* TOP BAR - Mobile/Tablet view */}
            <div className="lg:hidden mb-4">
              <div className="flex items-center gap-2">
                {/* Mobile Search */}
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search auctions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-[#d6482b] focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-500 hover:text-[#d6482b]" />
                    </button>
                  )}
                </div>

                {/* Filter Button with Badge */}
                <button
                  onClick={() => setIsFilterSidebarOpen(true)}
                  className="relative p-2.5 border-2 border-gray-200 rounded-lg hover:border-[#d6482b] transition-colors"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#d6482b] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none border-2 border-gray-200 rounded-lg pl-3 pr-8 py-2.5 text-sm bg-white hover:border-[#d6482b] focus:border-[#d6482b] focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="ending-soon">Ending Soon</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Desktop Layout - Sidebar + Content */}
            <div className="flex gap-6">
              {/* Desktop Sidebar Filters - Hidden on mobile/tablet */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-lg p-5 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <AdjustmentsHorizontalIcon className="w-5 h-5" />
                      Filters
                    </h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-[#d6482b] hover:text-[#b33a22] font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Search in sidebar */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-[#d6482b] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-[#d6482b] focus:border-[#d6482b] focus:outline-none"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range (₹)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-1/2 px-3 py-2 border-2 border-gray-200 rounded-lg hover:border-[#d6482b] focus:border-[#d6482b] focus:outline-none"
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-1/2 px-3 py-2 border-2 border-gray-200 rounded-lg hover:border-[#d6482b] focus:border-[#d6482b] focus:outline-none"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {activeFilterCount > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">
                        Active filters: {activeFilterCount}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCategory && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-[#d6482b] text-xs rounded">
                            {selectedCategory}
                            <button onClick={() => setSelectedCategory("")}>
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                        {minPrice && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-[#d6482b] text-xs rounded">
                            Min: ₹{minPrice}
                            <button onClick={() => setMinPrice("")}>
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                        {maxPrice && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-[#d6482b] text-xs rounded">
                            Max: ₹{maxPrice}
                            <button onClick={() => setMaxPrice("")}>
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1">
                {/* Desktop Top Bar - Sort and View Toggle */}
                <div className="hidden lg:flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-semibold">
                      {filteredAuctions.length}
                    </span>{" "}
                    results
                  </p>

                  <div className="flex items-center gap-3">
                    {/* Sort Dropdown */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none border-2 border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm bg-white hover:border-[#d6482b] focus:border-[#d6482b] focus:outline-none cursor-pointer"
                      >
                        <option value="newest">Sort: Newest</option>
                        <option value="ending-soon">Sort: Ending Soon</option>
                        <option value="price-low">
                          Sort: Price: Low to High
                        </option>
                        <option value="price-high">
                          Sort: Price: High to Low
                        </option>
                      </select>
                      <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* View Toggle */}
                    <div className="flex border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 transition-colors ${
                          viewMode === "grid"
                            ? "bg-[#d6482b] text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                        aria-label="Grid view"
                      >
                        <Squares2X2Icon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 transition-colors ${
                          viewMode === "list"
                            ? "bg-[#d6482b] text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                        aria-label="List view"
                      >
                        <Bars3Icon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* RESULTS */}
                {filteredAuctions.length === 0 ? (
                  <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-16 text-center">
                    <NoSymbolIcon className="w-16 h-16 mx-auto text-gray-400 mb-6" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-3">
                      No Auctions Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search or filters
                    </p>

                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="bg-[#d6482b] text-white px-6 py-3 rounded-lg hover:bg-[#b33a22] transition-colors font-medium"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {viewMode === "grid" ? (
                      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                              viewMode={viewMode}
                              compact={true}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
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
                          Load More Auctions
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Sidebar */}
      <Transition appear show={isFilterSidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={() => setIsFilterSidebarOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="bg-[#d6482b] px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-semibold text-white flex items-center gap-2">
                            <AdjustmentsHorizontalIcon className="w-5 h-5" />
                            Filters
                          </Dialog.Title>
                          <button
                            onClick={() => setIsFilterSidebarOpen(false)}
                            className="text-white hover:text-gray-200"
                          >
                            <XMarkIcon className="w-6 h-6" />
                          </button>
                        </div>
                      </div>

                      <div className="relative flex-1 px-4 py-6 sm:px-6">
                        {/* Category Filter */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={tempFilters.category}
                            onChange={(e) =>
                              setTempFilters((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white focus:border-[#d6482b] focus:outline-none"
                          >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price Range (₹)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Min"
                              value={tempFilters.minPrice}
                              onChange={(e) =>
                                setTempFilters((prev) => ({
                                  ...prev,
                                  minPrice: e.target.value,
                                }))
                              }
                              className="w-1/2 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#d6482b] focus:outline-none"
                              min="0"
                            />
                            <input
                              type="number"
                              placeholder="Max"
                              value={tempFilters.maxPrice}
                              onChange={(e) =>
                                setTempFilters((prev) => ({
                                  ...prev,
                                  maxPrice: e.target.value,
                                }))
                              }
                              className="w-1/2 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#d6482b] focus:outline-none"
                              min="0"
                            />
                          </div>
                        </div>

                        {/* Sort Options in Mobile Filter */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort By
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white focus:border-[#d6482b] focus:outline-none"
                          >
                            <option value="newest">Newest First</option>
                            <option value="ending-soon">Ending Soon</option>
                            <option value="price-low">
                              Price: Low to High
                            </option>
                            <option value="price-high">
                              Price: High to Low
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Footer Buttons */}
                      <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setTempFilters({
                                category: "",
                                minPrice: "",
                                maxPrice: "",
                              });
                              clearFilters();
                            }}
                            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                          >
                            Clear
                          </button>
                          <button
                            onClick={applyMobileFilters}
                            className="flex-1 px-4 py-2 bg-[#d6482b] text-white rounded-lg font-medium hover:bg-[#b33a22] transition-colors"
                          >
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Auctions;
