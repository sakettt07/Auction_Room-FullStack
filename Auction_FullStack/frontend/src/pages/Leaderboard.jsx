import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchLeaderboard } from "@/store/slices/userSlice";
import Spinner from "@/custom-components/Spinner";
import {
  TrophyIcon,
  UserIcon,
  CurrencyRupeeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SparklesIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  FireIcon,
  TagIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { FaCrown, FaMedal, FaAward, FaGem } from "react-icons/fa";

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { loading, leaderboard = [] } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("moneySpent");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterSegment, setFilterSegment] = useState("all"); // 'all', 'winners', 'spenders'
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch or refresh leaderboard on mount
  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(fetchLeaderboard());
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Compute overall summary statistics
  const stats = useMemo(() => {
    if (!leaderboard || !leaderboard.length) {
      return {
        totalBidders: 0,
        totalMoneySpent: 0,
        totalAuctionsWon: 0,
        avgMoneySpent: 0,
      };
    }

    const totalMoneySpent = leaderboard.reduce(
      (sum, bidder) => sum + (Number(bidder.moneySpent) || 0),
      0
    );
    const totalAuctionsWon = leaderboard.reduce(
      (sum, bidder) => sum + (Number(bidder.auctionsWon) || 0),
      0
    );

    return {
      totalBidders: leaderboard.length,
      totalMoneySpent,
      totalAuctionsWon,
      avgMoneySpent:
        Math.round(totalMoneySpent / (leaderboard.length || 1)) || 0,
    };
  }, [leaderboard]);

  // Dynamic VIP tier helper
  const getTierBadge = (moneySpent, rank) => {
    const spend = Number(moneySpent) || 0;
    if (rank === 0 || spend >= 100000) {
      return {
        label: "Diamond Patron",
        color: "bg-blue-50 text-blue-700 border-blue-200/80",
        icon: <FaGem className="w-3 h-3 text-blue-500" />,
      };
    }
    if (rank <= 2 || spend >= 50000) {
      return {
        label: "Platinum Patron",
        color: "bg-purple-50 text-purple-700 border-purple-200/80",
        icon: <FaCrown className="w-3 h-3 text-purple-500" />,
      };
    }
    if (spend >= 20000) {
      return {
        label: "Gold Patron",
        color: "bg-amber-50 text-amber-800 border-amber-200/80",
        icon: <FaAward className="w-3 h-3 text-amber-600" />,
      };
    }
    return {
      label: "Verified Collector",
      color: "bg-stone-50 text-stone-600 border-stone-200",
      icon: <ShieldCheckIcon className="w-3 h-3 text-stone-400" />,
    };
  };

  // Filter and sort
  const filteredLeaderboard = useMemo(() => {
    let filtered = [...leaderboard];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (bidder) =>
          bidder.userName?.toLowerCase().includes(term) ||
          bidder._id?.toLowerCase().includes(term)
      );
    }

    // Segment filter
    if (filterSegment === "winners") {
      filtered = filtered.filter((bidder) => Number(bidder.auctionsWon) > 0);
    } else if (filterSegment === "spenders") {
      filtered = filtered.filter((bidder) => Number(bidder.moneySpent) >= 10000);
    }

    // Sorting
    filtered.sort((a, b) => {
      const aVal = Number(a[sortBy]) || 0;
      const bVal = Number(b[sortBy]) || 0;
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

    return filtered;
  }, [leaderboard, searchTerm, sortBy, sortOrder, filterSegment]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterSegment("all");
    setSortBy("moneySpent");
    setSortOrder("desc");
  };

  const hasActiveFilters =
    searchTerm || filterSegment !== "all" || sortBy !== "moneySpent" || sortOrder !== "desc";

  // Top 3 Podium slice (always based on primary spend/rank order)
  const topThree = useMemo(() => {
    const sorted = [...leaderboard].sort(
      (a, b) => (Number(b.moneySpent) || 0) - (Number(a.moneySpent) || 0)
    );
    return sorted.slice(0, 3);
  }, [leaderboard]);

  return (
    <div className="min-h-screen bg-stone-50/60 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HERO HEADER */}
        <div className="relative text-center max-w-3xl mx-auto">
          {/* Subtle Ambient Blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-36 bg-[#D6482B]/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200/70 shadow-sm mb-4">
            <TrophyIcon className="w-4 h-4 text-amber-600" />
            <span>AuctionSpace Hall of Fame</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Elite Collectors & Top Bidders
          </h1>

          <p className="mt-3 text-stone-500 text-sm sm:text-base leading-relaxed">
            Honoring our most active patrons, victorious bidders, and distinguished
            curators driving competitive live auctions across the globe.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 shadow-sm hover:bg-stone-50 hover:border-stone-300 transition-all active:scale-95 disabled:opacity-50"
            >
              <ArrowPathIcon
                className={`w-3.5 h-3.5 text-stone-500 ${
                  isRefreshing ? "animate-spin text-[#D6482B]" : ""
                }`}
              />
              <span>{isRefreshing ? "Syncing Board..." : "Refresh Rankings"}</span>
            </button>
            <Link
              to="/auctions"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#D6482B] text-white shadow-sm hover:bg-[#c03e23] transition-all"
            >
              <span>Explore Active Drops</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* METRICS & IMPACT SUMMARY */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Active Patrons
              </span>
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                <UserIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-stone-900">
              {stats.totalBidders}
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Vetted collectors on board
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Cumulative Spend
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CurrencyRupeeIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-emerald-600">
              ₹{stats.totalMoneySpent.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Total capital deployed
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Victories Won
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <TrophyIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-amber-600">
              {stats.totalAuctionsWon}
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Completed hammer acquisitions
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Avg Patron Spend
              </span>
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#D6482B]">
                <FireIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-[#D6482B]">
              ₹{stats.avgMoneySpent.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Average ticket size per collector
            </p>
          </div>
        </div>

        {/* TOP 3 COLLECTORS PODIUM (Spotlight) */}
        {!loading && topThree.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                  <FaCrown className="text-amber-500 w-5 h-5" />
                  <span>The Podium Champions</span>
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  Leading the market with unprecedented volume and acquisition dominance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6">
              {/* RANK 2 - SILVER (Left on desktop) */}
              {topThree[1] && (
                <div className="order-2 md:order-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-200" />
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      🥈 Rank 2 • Silver
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      ID: {topThree[1]._id?.slice(-6)}
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-slate-200 to-slate-400 shadow-inner mb-3">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white">
                        {topThree[1].profileImage?.url ? (
                          <img
                            src={topThree[1].profileImage.url}
                            alt={topThree[1].userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center font-black text-slate-500 text-xl">
                            {topThree[1].userName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shadow">
                        <FaMedal className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-stone-900 leading-tight">
                      {topThree[1].userName}
                    </h3>
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-slate-500 font-medium">
                      <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-500" />
                      Verified VIP
                    </span>

                    <div className="w-full grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-stone-100 text-left">
                      <div className="bg-stone-50 rounded-xl p-2.5">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Total Volume
                        </span>
                        <span className="text-sm font-black text-stone-900">
                          ₹{Number(topThree[1].moneySpent || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-2.5">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Wins
                        </span>
                        <span className="text-sm font-black text-slate-700">
                          🏆 {topThree[1].auctionsWon || 0} lots
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RANK 1 - GOLD GRAND CHAMPION (Center, elevated) */}
              {topThree[0] && (
                <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50/70 to-white rounded-3xl p-7 border-2 border-amber-300/80 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 md:-mt-6">
                  {/* Glowing Aura */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500" />
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-amber-950 shadow-sm">
                      👑 Grand Champion
                    </span>
                    <span className="text-xs text-amber-800/60 font-mono font-medium">
                      ID: {topThree[0]._id?.slice(-6)}
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 rounded-full p-1.5 bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 shadow-md mb-3">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white">
                        {topThree[0].profileImage?.url ? (
                          <img
                            src={topThree[0].profileImage.url}
                            alt={topThree[0].userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-amber-50 flex items-center justify-center font-black text-amber-700 text-2xl">
                            {topThree[0].userName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-lg">
                        <FaCrown className="w-4 h-4 text-amber-950" />
                      </div>
                    </div>

                    <h3 className="font-extrabold text-xl text-stone-900 leading-tight flex items-center gap-1.5">
                      <span>{topThree[0].userName}</span>
                      <SparklesIcon className="w-4 h-4 text-amber-500" />
                    </h3>
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-amber-800 font-bold bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                      Diamond Tier Patron #1
                    </span>

                    <div className="w-full grid grid-cols-2 gap-2.5 mt-6 pt-4 border-t border-amber-100 text-left">
                      <div className="bg-amber-100/50 rounded-xl p-3 border border-amber-200/50">
                        <span className="text-[10px] uppercase font-black text-amber-800 block">
                          Total Deployed
                        </span>
                        <span className="text-base font-black text-stone-900">
                          ₹{Number(topThree[0].moneySpent || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-amber-100/50 rounded-xl p-3 border border-amber-200/50">
                        <span className="text-[10px] uppercase font-black text-amber-800 block">
                          Hammer Wins
                        </span>
                        <span className="text-base font-black text-amber-900">
                          🏆 {topThree[0].auctionsWon || 0} lots
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RANK 3 - BRONZE (Right on desktop) */}
              {topThree[2] && (
                <div className="order-3 bg-white rounded-3xl p-6 border border-orange-200/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-300 via-amber-600 to-orange-400" />

                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200">
                      🥉 Rank 3 • Bronze
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      ID: {topThree[2]._id?.slice(-6)}
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-orange-200 to-amber-600 shadow-inner mb-3">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white">
                        {topThree[2].profileImage?.url ? (
                          <img
                            src={topThree[2].profileImage.url}
                            alt={topThree[2].userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-50 flex items-center justify-center font-black text-orange-600 text-xl">
                            {topThree[2].userName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center shadow">
                        <FaAward className="w-3.5 h-3.5 text-orange-700" />
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-stone-900 leading-tight">
                      {topThree[2].userName}
                    </h3>
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-stone-500 font-medium">
                      <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-500" />
                      Verified VIP
                    </span>

                    <div className="w-full grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-stone-100 text-left">
                      <div className="bg-stone-50 rounded-xl p-2.5">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Total Volume
                        </span>
                        <span className="text-sm font-black text-stone-900">
                          ₹{Number(topThree[2].moneySpent || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-2.5">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Wins
                        </span>
                        <span className="text-sm font-black text-orange-700">
                          🏆 {topThree[2].auctionsWon || 0} lots
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEARCH, FILTERS & CONTROLS BAR */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search collector name or patron ID..."
                className="w-full pl-11 pr-10 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Custom Filter Pills (No native select) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setFilterSegment("all")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterSegment === "all"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
                }`}
              >
                All Patrons ({leaderboard.length})
              </button>
              <button
                onClick={() => setFilterSegment("winners")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filterSegment === "winners"
                    ? "bg-[#D6482B] text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
                }`}
              >
                <TrophyIcon className="w-3.5 h-3.5" />
                <span>With Wins Only</span>
              </button>
              <button
                onClick={() => setFilterSegment("spenders")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filterSegment === "spenders"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
                }`}
              >
                <CurrencyRupeeIcon className="w-3.5 h-3.5" />
                <span>High Volume (₹10k+)</span>
              </button>
            </div>

            {/* Sort Toggle Buttons */}
            <div className="flex items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-stone-100">
              <button
                onClick={() => toggleSort("moneySpent")}
                className={`flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  sortBy === "moneySpent"
                    ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                }`}
              >
                <span>Expenditure</span>
                {sortBy === "moneySpent" &&
                  (sortOrder === "desc" ? (
                    <ChevronDownIcon className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronUpIcon className="w-3.5 h-3.5" />
                  ))}
              </button>

              <button
                onClick={() => toggleSort("auctionsWon")}
                className={`flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  sortBy === "auctionsWon"
                    ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                }`}
              >
                <span>Auctions Won</span>
                {sortBy === "auctionsWon" &&
                  (sortOrder === "desc" ? (
                    <ChevronDownIcon className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronUpIcon className="w-3.5 h-3.5" />
                  ))}
              </button>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
              <span className="text-stone-400 font-medium">Applied Filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-[#D6482B] border border-orange-200/60 font-semibold">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}>
                    <XMarkIcon className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}
              {filterSegment !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-[#D6482B] border border-orange-200/60 font-semibold">
                  {filterSegment === "winners" ? "Won Auctions Only" : "High Spenders (₹10k+)"}
                  <button onClick={() => setFilterSegment("all")}>
                    <XMarkIcon className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}
              {sortBy !== "moneySpent" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-semibold">
                  Sorted by Wins ({sortOrder})
                </span>
              )}
              <button
                onClick={clearFilters}
                className="ml-auto text-xs font-bold text-[#D6482B] hover:text-[#b33a22] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* LEADERBOARD TABLE / CARD LIST */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-stone-200/80 shadow-sm">
            <Spinner />
            <p className="mt-4 text-sm font-semibold text-stone-500">
              Compiling auction records & rankings...
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/80 text-stone-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 text-center w-20">Rank</th>
                    <th className="py-4 px-6">Collector</th>
                    <th className="py-4 px-6 hidden sm:table-cell">Prestige Tier</th>
                    <th className="py-4 px-6 text-center">Auctions Won</th>
                    <th className="py-4 px-6 text-right">
                      <button
                        onClick={() => toggleSort("moneySpent")}
                        className="inline-flex items-center gap-1 hover:text-stone-900 transition-colors uppercase"
                      >
                        <span>Cumulative Volume</span>
                        {sortBy === "moneySpent" &&
                          (sortOrder === "desc" ? (
                            <ChevronDownIcon className="w-3.5 h-3.5 text-[#D6482B]" />
                          ) : (
                            <ChevronUpIcon className="w-3.5 h-3.5 text-[#D6482B]" />
                          ))}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                  {filteredLeaderboard.length > 0 ? (
                    filteredLeaderboard.map((bidder, index) => {
                      const tier = getTierBadge(bidder.moneySpent, index);
                      const isTopThree = index < 3;

                      return (
                        <tr
                          key={bidder._id || index}
                          className={`hover:bg-orange-50/40 transition-colors ${
                            isTopThree ? "bg-amber-50/20" : ""
                          }`}
                        >
                          {/* Rank Column */}
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center">
                              {index === 0 ? (
                                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-black text-xs shadow-sm">
                                  🥇
                                </span>
                              ) : index === 1 ? (
                                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center font-black text-xs shadow-sm">
                                  🥈
                                </span>
                              ) : index === 2 ? (
                                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-800 border border-orange-300 flex items-center justify-center font-black text-xs shadow-sm">
                                  🥉
                                </span>
                              ) : (
                                <span className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center font-bold text-xs">
                                  #{index + 1}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Collector Profile */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 shadow-sm">
                                {bidder.profileImage?.url ? (
                                  <img
                                    src={bidder.profileImage.url}
                                    alt={bidder.userName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-500 font-bold text-base">
                                    {bidder.userName?.charAt(0)?.toUpperCase() || "U"}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-stone-900 leading-tight">
                                    {bidder.userName}
                                  </p>
                                  {index === 0 && (
                                    <SparklesIcon className="w-4 h-4 text-amber-500" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[11px] text-stone-400 font-mono">
                                    ID: {bidder._id?.slice(-6) || "COLL"}
                                  </span>
                                  <span className="inline-block sm:hidden text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                                    {tier.label}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Prestige Tier (Desktop) */}
                          <td className="py-4 px-6 hidden sm:table-cell">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tier.color}`}
                            >
                              {tier.icon}
                              <span>{tier.label}</span>
                            </span>
                          </td>

                          {/* Auctions Won */}
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/60 shadow-2xs">
                              🏆 {bidder.auctionsWon || 0}
                            </span>
                          </td>

                          {/* Cumulative Expenditure */}
                          <td className="py-4 px-6 text-right">
                            <span className="text-base font-black text-stone-900 block">
                              ₹{Number(bidder.moneySpent || 0).toLocaleString()}
                            </span>
                            {Number(bidder.moneySpent) > 50000 && (
                              <span className="text-[10px] text-emerald-600 font-bold tracking-tight uppercase">
                                High Roller
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-16 text-center">
                        <div className="max-w-sm mx-auto flex flex-col items-center">
                          <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                            <MagnifyingGlassIcon className="w-7 h-7" />
                          </div>
                          <h4 className="text-base font-bold text-stone-800">
                            No Collectors Found
                          </h4>
                          <p className="text-xs text-stone-500 mt-1">
                            No collector records match your active search and filter parameters.
                          </p>
                          {hasActiveFilters && (
                            <button
                              onClick={clearFilters}
                              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition"
                            >
                              Reset All Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            {filteredLeaderboard.length > 0 && (
              <div className="px-6 py-4 bg-stone-50/80 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
                <span>
                  Displaying{" "}
                  <strong className="text-stone-800">{filteredLeaderboard.length}</strong> of{" "}
                  <strong className="text-stone-800">{leaderboard.length}</strong> registered
                  collectors
                </span>
                <span className="text-stone-400">
                  Rankings update in real-time upon auction hammer conclusion.
                </span>
              </div>
            )}
          </div>
        )}

        {/* VIP COLLECTOR BENEFITS / HOW TO CLIMB */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#D6482B]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D6482B]/20 text-orange-400 border border-[#D6482B]/30 mb-3">
              <FaGem className="w-3 h-3" />
              Prestige Collector Perks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Unlock Tier Privileges as You Bid & Acquire
            </h2>
            <p className="mt-2 text-stone-400 text-sm leading-relaxed">
              Every verified auction bid and won lot boosts your standing on the global board.
              Climb into Diamond and Platinum tiers to access private collector benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-100">
                VIP Catalog Previews
              </h3>
              <p className="mt-1 text-xs text-stone-400 leading-relaxed">
                48-hour early access to upcoming luxury drops, estate reserves, and high-value catalog releases.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-100">
                Waived Escrow Fees
              </h3>
              <p className="mt-1 text-xs text-stone-400 leading-relaxed">
                Diamond & Platinum patrons enjoy 0% escrow handling fees on high-ticket hammer settlements.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-3">
                <TrophyIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-100">
                Private Acquisition Manager
              </h3>
              <p className="mt-1 text-xs text-stone-400 leading-relaxed">
                Direct hotline to dedicated auction specialists for strategic proxy bids and logistics.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="text-xs text-stone-400">
              Ready to climb the rankings? Bid on live luxury lots today.
            </div>
            <Link
              to="/auctions"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-white text-stone-950 hover:bg-stone-100 transition-all shadow-md"
            >
              <span>Explore Live Auctions</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
