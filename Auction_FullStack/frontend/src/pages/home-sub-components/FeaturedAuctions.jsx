import Card from "@/custom-components/Card";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllAuctionItems } from "@/store/slices/auctionSlice";
import AuctionCardSkeleton from "@/custom-components/AuctionCardSkeleton";
import {
  FireIcon,
  SparklesIcon,
  ArrowRightIcon,
  TagIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const FeaturedAuctions = () => {
  const dispatch = useDispatch();
  const { allAuctions = [], loading } = useSelector((state) => state.auction);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'live', 'upcoming'

  useEffect(() => {
    // Load cached data instantly if present
    const cached = localStorage.getItem("auctions_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        dispatch({
          type: "auction/getAllAuctionItemSuccess",
          payload: parsed.data,
        });
      } catch (e) {
        console.error("Cache parsing error", e);
      }
    }

    // Always fetch fresh data in background
    dispatch(getAllAuctionItems());
  }, [dispatch]);

  // Extract unique categories from actual auction listings
  const dynamicCategories = useMemo(() => {
    const set = new Set();
    allAuctions.forEach((item) => {
      if (item.category && typeof item.category === "string") {
        set.add(item.category.trim());
      }
    });
    return ["All", ...Array.from(set).slice(0, 6)];
  }, [allAuctions]);

  // Sort auctions so newest products come first!
  const sortedAndFilteredAuctions = useMemo(() => {
    const now = new Date();

    // 1. Sort newest first using createdAt or MongoDB ObjectId timestamp
    const sorted = [...allAuctions].sort((a, b) => {
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

    // 2. Filter by category
    let result = sorted;
    if (selectedCategory !== "All") {
      result = result.filter(
        (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 3. Filter by status if selected
    if (statusFilter === "live") {
      result = result.filter((item) => {
        const start = item.startTime ? new Date(item.startTime) : null;
        const end = item.endTime ? new Date(item.endTime) : null;
        return start && end && now >= start && now <= end;
      });
    } else if (statusFilter === "upcoming") {
      result = result.filter((item) => {
        const start = item.startTime ? new Date(item.startTime) : null;
        return start && now < start;
      });
    }

    return result;
  }, [allAuctions, selectedCategory, statusFilter]);

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#D6482B] border border-orange-200/60 mb-2">
            <SparklesIcon className="w-3.5 h-3.5" />
            New Arrivals & Top Drops
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Featured Auctions
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-1 max-w-xl">
            Latest items listed first. Place real-time bids or discover exclusive verified lots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/auctions"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#D6482B] hover:text-[#b33a22] transition-colors group"
          >
            <span>View All Auctions ({allAuctions.length})</span>
            <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Filter and Category Pills Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-stone-200/70">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#D6482B] text-white shadow-md shadow-orange-500/20"
                  : "bg-white text-stone-600 border border-stone-200/80 hover:border-orange-300 hover:text-stone-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("live")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "upcoming"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Grid of Auction Cards */}
      {loading && allAuctions.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <AuctionCardSkeleton key={index} />
          ))}
        </div>
      ) : sortedAndFilteredAuctions.length === 0 ? (
        <div className="w-full py-16 px-4 bg-white rounded-3xl border border-stone-200/80 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#D6482B] flex items-center justify-center mb-4">
            <TagIcon className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">
            No auctions found in this selection
          </h3>
          <p className="text-stone-500 text-sm max-w-md mb-6">
            There are currently no active auctions matching "{selectedCategory}" with status "{statusFilter}".
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedCategory("All");
                setStatusFilter("all");
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
            >
              Reset Filters
            </button>
            <Link
              to="/create-auction"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#D6482B] text-white hover:bg-[#b33a22] transition shadow-sm"
            >
              Post First Auction
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedAndFilteredAuctions.slice(0, 8).map((element) => (
            <Card
              key={element._id}
              id={element._id}
              title={element.title}
              imgSrc={element.itemImage?.url}
              startTime={element.startTime}
              bids={element.bids}
              endTime={element.endTime}
              startingBid={element.startingPrice}
              currentBid={element.currentPrice}
              category={element.category}
              condition={element.condition}
            />
          ))}
        </div>
      )}

      {/* Bottom quick view button if more auctions exist */}
      {sortedAndFilteredAuctions.length > 8 && (
        <div className="mt-10 text-center">
          <Link
            to="/auctions"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-stone-800 bg-white border border-stone-200/90 hover:border-[#D6482B] hover:text-[#D6482B] shadow-sm hover:shadow-md transition-all"
          >
            Explore All {allAuctions.length} Auctions
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedAuctions;
