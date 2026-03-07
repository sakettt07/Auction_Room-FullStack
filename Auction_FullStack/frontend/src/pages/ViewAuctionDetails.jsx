import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import React, { useEffect, useState } from "react";
import {
  FaGreaterThan,
  FaTrophy,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaGavel,
  FaChartLine,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  TagIcon,
  CubeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const ViewAuctionDetails = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction,
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [showAllBidders, setShowAllBidders] = useState(false);
  const [bidStats, setBidStats] = useState({
    totalBids: 0,
    averageBid: 0,
    highestBid: 0,
    lowestBid: 0,
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role === "Bidder") {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated, id, dispatch, navigateTo, user?.role]);

  useEffect(() => {
    if (auctionBidders && auctionBidders.length > 0) {
      const bids = auctionBidders.map((b) => b.bidAmount);
      const total = bids.reduce((sum, bid) => sum + bid, 0);
      setBidStats({
        totalBids: auctionBidders.length,
        averageBid: Math.round(total / auctionBidders.length),
        highestBid: Math.max(...bids),
        lowestBid: Math.min(...bids),
      });
    }
  }, [auctionBidders]);

  if (!auctionDetail) return null;

  const auctionStarted = new Date(auctionDetail.startTime) < Date.now();
  const auctionEnded = new Date(auctionDetail.endTime) < Date.now();
  const sortedBidders = auctionBidders
    ? [...auctionBidders].sort((a, b) => b.bidAmount - a.bidAmount)
    : [];
  const displayedBidders = showAllBidders
    ? sortedBidders
    : sortedBidders.slice(0, 5);

  const getStatusBadge = () => {
    if (auctionEnded) {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          Ended
        </span>
      );
    } else if (auctionStarted) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium animate-pulse">
          Live Now
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          Upcoming
        </span>
      );
    }
  };

  return (
    <section className="w-full min-h-screen px-4 sm:px-5 pt-20 lg:pl-[320px] pb-10 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm mb-6">
        <Link
          to="/"
          className="text-gray-600 hover:text-[#D6482B] transition-colors"
        >
          Home
        </Link>
        <FaGreaterThan className="text-gray-400 text-xs" />
        <Link
          to="/view-my-auctions"
          className="text-gray-600 hover:text-[#D6482B] transition-colors"
        >
          My Auctions
        </Link>
        <FaGreaterThan className="text-gray-400 text-xs" />
        <p className="text-[#D6482B] font-medium truncate">
          {auctionDetail.title}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT SECTION - Main Details (spans 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header with Status */}
              <div className="bg-gradient-to-r from-[#d6482b] to-orange-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-white">
                    {auctionDetail.title}
                  </h1>
                  {getStatusBadge()}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Image and Basic Info */}
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  {/* Image */}
                  <div className="w-full md:w-64 h-64 bg-gray-100 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={
                        auctionDetail.itemImage?.url || "/placeholder-image.jpg"
                      }
                      alt={auctionDetail.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">
                        Starting Price
                      </p>
                      <p className="text-xl font-bold text-[#d6482b]">
                        ₹{auctionDetail.startingPrice?.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">
                        Current Price
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        ₹
                        {(
                          auctionDetail.currentPrice ||
                          auctionDetail.startingPrice
                        )?.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Category</p>
                      <div className="flex items-center gap-1">
                        <TagIcon className="w-4 h-4 text-blue-500" />
                        <p className="font-semibold">
                          {auctionDetail.category}
                        </p>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Condition</p>
                      <div className="flex items-center gap-1">
                        <CubeIcon className="w-4 h-4 text-purple-500" />
                        <p className="font-semibold">
                          {auctionDetail.condition}
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Start Time</p>
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3 text-yellow-600" />
                        <p className="text-sm font-medium">
                          {new Date(
                            auctionDetail.startTime,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(auctionDetail.startTime).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">End Time</p>
                      <div className="flex items-center gap-1">
                        <FaClock className="w-3 h-3 text-red-600" />
                        <p className="text-sm font-medium">
                          {new Date(auctionDetail.endTime).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(auctionDetail.endTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#d6482b] rounded-full"></span>
                    Description
                  </h3>
                  <div className="prose max-w-none">
                    {auctionDetail.description ? (
                      <div className="space-y-2 text-gray-600">
                        {auctionDetail.description.split(". ").map(
                          (text, i) =>
                            text.trim() && (
                              <p key={i} className="text-sm leading-relaxed">
                                • {text}
                              </p>
                            ),
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        No description available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - Bids Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
              {/* Header */}
              <div className="bg-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FaGavel className="w-4 h-4" />
                    Bids ({auctionBidders?.length || 0})
                  </h2>
                  {bidStats.totalBids > 0 && (
                    <span className="text-xs text-gray-300">
                      Avg: ₹{bidStats.averageBid.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Bid Stats Cards */}
              {bidStats.totalBids > 0 && (
                <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 border-b border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Highest</p>
                    <p className="text-sm font-bold text-green-600">
                      ₹{bidStats.highestBid.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Average</p>
                    <p className="text-sm font-bold text-blue-600">
                      ₹{bidStats.averageBid.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Lowest</p>
                    <p className="text-sm font-bold text-orange-600">
                      ₹{bidStats.lowestBid.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Bids List */}
              <div className="p-4 max-h-[500px] overflow-y-auto">
                {sortedBidders && sortedBidders.length > 0 ? (
                  <div className="space-y-3">
                    {displayedBidders.map((bid, index) => (
                      <div
                        key={bid._id || index}
                        className={`relative flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-md ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200"
                            : index === 1
                              ? "bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200"
                              : index === 2
                                ? "bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200"
                                : "bg-gray-50 border border-gray-100"
                        }`}
                      >
                        {/* Rank Badge */}
                        {index < 3 && (
                          <div
                            className={`absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0
                                ? "bg-yellow-400 text-yellow-900"
                                : index === 1
                                  ? "bg-gray-400 text-white"
                                  : "bg-orange-400 text-white"
                            }`}
                          >
                            {index + 1}
                          </div>
                        )}

                        {/* Profile Image */}
                        <div className="relative">
                          {bid.profileImage ? (
                            <img
                              src={bid.profileImage}
                              alt={bid.userName}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaUser className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          {index === 0 && (
                            <FaTrophy className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" />
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {bid.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              bid.createdAt || Date.now(),
                            ).toLocaleTimeString()}
                          </p>
                        </div>

                        {/* Bid Amount */}
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              index === 0
                                ? "text-yellow-600"
                                : index === 1
                                  ? "text-gray-600"
                                  : index === 2
                                    ? "text-orange-600"
                                    : "text-[#d6482b]"
                            }`}
                          >
                            ₹{bid.bidAmount?.toLocaleString()}
                          </p>
                          {index === 0 && auctionEnded && (
                            <span className="text-[10px] text-green-600 font-medium">
                              Winner
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Show More/Less Button */}
                    {sortedBidders.length > 5 && (
                      <button
                        onClick={() => setShowAllBidders(!showAllBidders)}
                        className="w-full mt-3 flex items-center justify-center gap-1 text-sm text-[#d6482b] hover:text-[#b33a22] transition-colors py-2 border-t border-gray-100"
                      >
                        {showAllBidders ? (
                          <>
                            Show Less <ChevronUpIcon className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Show {sortedBidders.length - 5} More Bids{" "}
                            <ChevronDownIcon className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    {!auctionStarted ? (
                      <>
                        <img
                          src="/notStarted.png"
                          alt="Not Started"
                          className="w-32 mx-auto mb-4 opacity-50"
                        />
                        <p className="text-gray-500 text-sm">
                          Auction hasn't started yet
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Starts{" "}
                          {new Date(
                            auctionDetail.startTime,
                          ).toLocaleDateString()}
                        </p>
                      </>
                    ) : auctionEnded ? (
                      <>
                        <img
                          src="/auctionEnded.png"
                          alt="Ended"
                          className="w-32 mx-auto mb-4 opacity-50"
                        />
                        <p className="text-gray-500 text-sm">Auction ended</p>
                        <p className="text-xs text-gray-400 mt-1">
                          No bids were placed
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaGavel className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">No bids yet</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Be the first to place a bid!
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Summary Footer */}
              {sortedBidders.length > 0 && (
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 flex items-center gap-1">
                      <UserGroupIcon className="w-3 h-3" />
                      Total Bidders
                    </span>
                    <span className="font-semibold">
                      {sortedBidders.length}
                    </span>
                  </div>
                  {auctionEnded && (
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-gray-600 flex items-center gap-1">
                        <FaTrophy className="w-3 h-3 text-yellow-500" />
                        Winning Bid
                      </span>
                      <span className="font-semibold text-green-600">
                        ₹{sortedBidders[0]?.bidAmount?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewAuctionDetails;
