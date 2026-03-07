import Spinner from "@/custom-components/Spinner";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  TrophyIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SparklesIcon,
  // CrownIcon,
} from "@heroicons/react/24/outline";
import { FaMedal, FaStar } from "react-icons/fa";

const Leaderboard = () => {
  const { loading, leaderboard = [] } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("moneySpent");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterWinners, setFilterWinners] = useState("all");

  // Calculate stats
  const stats = useMemo(() => {
    if (!leaderboard.length)
      return {
        totalBidders: 0,
        totalMoneySpent: 0,
        totalAuctionsWon: 0,
        avgMoneySpent: 0,
      };

    const totalMoneySpent = leaderboard.reduce(
      (sum, bidder) => sum + (bidder.moneySpent || 0),
      0,
    );
    const totalAuctionsWon = leaderboard.reduce(
      (sum, bidder) => sum + (bidder.auctionsWon || 0),
      0,
    );

    return {
      totalBidders: leaderboard.length,
      totalMoneySpent,
      totalAuctionsWon,
      avgMoneySpent: Math.round(totalMoneySpent / leaderboard.length) || 0,
    };
  }, [leaderboard]);

  // Filter and sort leaderboard
  const filteredLeaderboard = useMemo(() => {
    let filtered = [...leaderboard];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((bidder) =>
        bidder.userName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply winner filter
    if (filterWinners === "winners") {
      filtered = filtered.filter((bidder) => bidder.auctionsWon > 0);
    } else if (filterWinners === "spenders") {
      filtered = filtered.filter((bidder) => bidder.moneySpent > 1000);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy] || 0;
      const bValue = b[sortBy] || 0;

      if (sortOrder === "desc") {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });

    return filtered.slice(0, 100);
  }, [leaderboard, searchTerm, sortBy, sortOrder, filterWinners]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "from-yellow-400 to-yellow-500";
      case 1:
        return "from-gray-300 to-gray-400";
      case 2:
        return "from-orange-300 to-orange-400";
      default:
        return "from-gray-100 to-gray-200";
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FaMedal className="w-4 h-4 text-yellow-600" />;
      case 1:
        return <FaMedal className="w-4 h-4 text-gray-500" />;
      case 2:
        return <FaStar className="w-4 h-4 text-orange-500" />;
      default:
        return (
          <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
        );
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterWinners("all");
    setSortBy("moneySpent");
    setSortOrder("desc");
  };

  const hasActiveFilters =
    searchTerm || filterWinners !== "all" || sortBy !== "moneySpent";

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-2 bg-orange-100 rounded-full mb-4">
              <TrophyIcon className="w-8 h-8 text-[#D6482B]" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#D6482B] to-orange-500 bg-clip-text text-transparent mb-3">
              Bidders Leaderboard
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Top bidders competing for the finest auction items. Who will claim
              the crown?
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-500 mb-1">Total Bidders</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalBidders}
              </p>
              <p className="text-xs text-gray-400 mt-1">Active participants</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-500 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{stats.totalMoneySpent.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">Combined expenditure</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-500 mb-1">Auctions Won</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalAuctionsWon}
              </p>
              <p className="text-xs text-gray-400 mt-1">Total victories</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-500">
              <p className="text-sm text-gray-500 mb-1">Average Spend</p>
              <p className="text-2xl font-bold text-orange-600">
                ₹{stats.avgMoneySpent.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">Per bidder</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner />
            </div>
          ) : (
            <>
              {/* Filters Bar */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bidders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D6482B] focus:border-transparent outline-none transition"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>

                  {/* Filter Dropdown */}
                  <div className="flex gap-3">
                    <select
                      value={filterWinners}
                      onChange={(e) => setFilterWinners(e.target.value)}
                      className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D6482B] focus:border-transparent outline-none bg-white"
                    >
                      <option value="all">All Bidders</option>
                      <option value="winners">With Wins</option>
                      <option value="spenders">High Spenders</option>
                    </select>

                    {/* Sort Buttons */}
                    <button
                      onClick={() => toggleSort("moneySpent")}
                      className={`px-4 py-2.5 rounded-lg border transition flex items-center gap-2 ${
                        sortBy === "moneySpent"
                          ? "bg-[#D6482B] text-white border-[#D6482B]"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <CurrencyDollarIcon className="w-4 h-4" />
                      Spend
                      {sortBy === "moneySpent" &&
                        (sortOrder === "desc" ? (
                          <ChevronDownIcon className="w-4 h-4" />
                        ) : (
                          <ChevronUpIcon className="w-4 h-4" />
                        ))}
                    </button>

                    <button
                      onClick={() => toggleSort("auctionsWon")}
                      className={`px-4 py-2.5 rounded-lg border transition flex items-center gap-2 ${
                        sortBy === "auctionsWon"
                          ? "bg-[#D6482B] text-white border-[#D6482B]"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <TrophyIcon className="w-4 h-4" />
                      Wins
                      {sortBy === "auctionsWon" &&
                        (sortOrder === "desc" ? (
                          <ChevronDownIcon className="w-4 h-4" />
                        ) : (
                          <ChevronUpIcon className="w-4 h-4" />
                        ))}
                    </button>
                  </div>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Active filters:
                    </span>
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded">
                        Search: "{searchTerm}"
                        <button onClick={() => setSearchTerm("")}>
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filterWinners !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded">
                        {filterWinners === "winners"
                          ? "With wins"
                          : "High spenders"}
                        <button onClick={() => setFilterWinners("all")}>
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[#D6482B] hover:underline ml-auto"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Leaderboard Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                        <th className="py-4 px-6 text-left text-sm font-semibold">
                          Rank
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold">
                          Bidder
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold">
                          <button
                            onClick={() => toggleSort("moneySpent")}
                            className="flex items-center gap-2 hover:text-[#D6482B] transition"
                          >
                            <CurrencyDollarIcon className="w-4 h-4" />
                            Total Spent
                            {sortBy === "moneySpent" &&
                              (sortOrder === "desc" ? (
                                <ChevronDownIcon className="w-4 h-4" />
                              ) : (
                                <ChevronUpIcon className="w-4 h-4" />
                              ))}
                          </button>
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold">
                          <button
                            onClick={() => toggleSort("auctionsWon")}
                            className="flex items-center gap-2 hover:text-[#D6482B] transition"
                          >
                            <TrophyIcon className="w-4 h-4" />
                            Auctions Won
                            {sortBy === "auctionsWon" &&
                              (sortOrder === "desc" ? (
                                <ChevronDownIcon className="w-4 h-4" />
                              ) : (
                                <ChevronUpIcon className="w-4 h-4" />
                              ))}
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredLeaderboard.length > 0 ? (
                        filteredLeaderboard.map((bidder, index) => (
                          <tr
                            key={bidder._id}
                            className={`hover:bg-gray-50 transition-colors group ${
                              index < 3
                                ? "bg-gradient-to-r " + getRankColor(index)
                                : ""
                            }`}
                          >
                            <td className="py-4 px-6">
                              <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                  index === 0
                                    ? "bg-yellow-100 text-yellow-600"
                                    : index === 1
                                      ? "bg-gray-100 text-gray-600"
                                      : index === 2
                                        ? "bg-orange-100 text-orange-600"
                                        : "bg-gray-50 text-gray-400"
                                }`}
                              >
                                {getRankIcon(index)}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  {bidder.profileImage?.url ? (
                                    <img
                                      src={bidder.profileImage.url}
                                      alt={bidder.userName}
                                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <UserIcon className="w-5 h-5 text-gray-500" />
                                    </div>
                                  )}
                                  {index === 0 && (
                                    <SparklesIcon className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {bidder.userName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ID: {bidder._id.slice(-6)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#D6482B]">
                                  ₹{bidder.moneySpent?.toLocaleString() || 0}
                                </span>
                                {bidder.moneySpent > 10000 && (
                                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                                    Top Spender
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">
                                  {bidder.auctionsWon || 0}
                                </span>
                                {bidder.auctionsWon > 5 && (
                                  <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                                    <TrophyIcon className="w-3 h-3" />
                                    Champion
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <UserIcon className="w-12 h-12 text-gray-300 mb-3" />
                              <p className="text-gray-500 text-sm">
                                No bidders found matching your criteria
                              </p>
                              {hasActiveFilters && (
                                <button
                                  onClick={clearFilters}
                                  className="mt-3 text-[#D6482B] text-sm hover:underline"
                                >
                                  Clear filters
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                {filteredLeaderboard.length > 0 && (
                  <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 border-t border-gray-100">
                    Showing {filteredLeaderboard.length} of {leaderboard.length}{" "}
                    bidders
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Leaderboard;
