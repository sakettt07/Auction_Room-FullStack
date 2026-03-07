import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { deleteAuction, republishAuction } from "@/store/slices/auctionSlice";
import {
  ClockIcon,
  UserIcon,
  TrophyIcon,
  EyeIcon,
  TrashIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const CardTwo = ({
  imgSrc,
  title,
  startingBid,
  currentPrice,
  startTime,
  endTime,
  id,
  bids = [],
  highestBidder,
  category,
  condition,
  compact = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [winner, setWinner] = useState(null);

  const dispatch = useDispatch();
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  const isLive = now >= start && now <= end;
  const isUpcoming = now < start;
  const isEnded = now > end;

  const totalBids = bids.length;
  const highestBid =
    bids.length > 0 ? Math.max(...bids.map((b) => b.bidAmount)) : startingBid;

  // Find winner details
  useEffect(() => {
    if (isEnded && bids.length > 0) {
      const winningBid = bids.reduce(
        (max, bid) => (bid.bidAmount > max.bidAmount ? bid : max),
        bids[0],
      );
      setWinner(winningBid);
    }
  }, [isEnded, bids]);

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-0.5">
          <SparklesIcon className="w-2.5 h-2.5" />
          LIVE
        </span>
      );
    } else if (isUpcoming) {
      return (
        <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
          UPCOMING
        </span>
      );
    } else {
      return (
        <span className="bg-gray-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
          ENDED
        </span>
      );
    }
  };

  // Determine the bid label based on auction status
  const getBidLabel = () => {
    if (isUpcoming) {
      return "Minimum Bid";
    } else if (isLive) {
      return "Last Bid";
    } else if (isEnded) {
      return "Winning Bid";
    }
    return "Current Bid";
  };

  // Determine the bid amount to display
  const getBidAmount = () => {
    if (isUpcoming) {
      return startingBid;
    } else if (isLive) {
      return currentPrice || startingBid;
    } else if (isEnded) {
      return currentPrice || startingBid;
    }
    return currentPrice || startingBid;
  };

  // Get bid amount color based on status
  const getBidAmountColor = () => {
    if (isEnded && winner) {
      return "text-green-600";
    } else if (isLive) {
      return "text-[#d6482b]";
    }
    return "text-gray-800";
  };

  const bidLabel = getBidLabel();
  const bidAmount = getBidAmount();
  const bidAmountColor = getBidAmountColor();

  const handleDeleteAuction = () => {
    if (window.confirm("Are you sure you want to delete this auction?")) {
      dispatch(deleteAuction(id));
    }
  };

  // Compact card design
  if (compact) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100">
          {/* Image Section - Smaller height */}
          <div className="relative h-32 overflow-hidden">
            <img
              src={imgSrc || "/placeholder-image.jpg"}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Status Badge */}
            <div className="absolute top-1.5 left-1.5">{getStatusBadge()}</div>

            {/* Bid Count Badge - Only show for live/ended with bids */}
            {totalBids > 0 && (isLive || isEnded) && (
              <div className="absolute top-1.5 right-1.5 bg-black/50 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full text-[9px] font-medium">
                {totalBids} {totalBids === 1 ? "bid" : "bids"}
              </div>
            )}

            {/* Sold Badge for Ended Auctions with Winner */}
            {isEnded && winner && (
              <div className="absolute bottom-1.5 right-1.5 bg-yellow-500 text-white px-1.5 py-0.5 rounded-full text-[8px] font-medium flex items-center gap-0.5">
                <TrophyIcon className="w-2.5 h-2.5" />
                SOLD
              </div>
            )}
          </div>

          {/* Content Section - Compact padding */}
          <div className="p-2.5">
            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-[#d6482b] transition-colors">
              {title}
            </h3>

            {/* Category & Condition */}
            <div className="flex items-center gap-1 mb-2">
              {category && (
                <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {category}
                </span>
              )}
              {condition && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded ${
                    condition === "New"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {condition}
                </span>
              )}
            </div>

            {/* Starting Price */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-gray-400">Starting</span>
              <span className="text-[10px] font-medium text-gray-600">
                ₹{startingBid?.toLocaleString()}
              </span>
            </div>

            {/* Dynamic Bid Label and Amount */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-gray-600">
                {bidLabel}
              </span>
              <span className={`text-xs font-bold ${bidAmountColor}`}>
                ₹{bidAmount?.toLocaleString()}
              </span>
            </div>

            {/* Winner Info for Ended Auctions - Compact */}
            {isEnded && winner && (
              <div className="mb-2 p-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded border border-yellow-100">
                <div className="flex items-center gap-1">
                  <TrophyIcon className="w-3 h-3 text-yellow-600" />
                  <span className="text-[9px] font-medium text-yellow-700">
                    Winner
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {winner.profileImage ? (
                    <img
                      src={winner.profileImage}
                      alt={winner.userName}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="w-2 h-2 text-gray-500" />
                    </div>
                  )}
                  <span className="text-[9px] font-medium text-gray-800 truncate flex-1">
                    {winner.userName}
                  </span>
                  <span className="text-[9px] font-bold text-[#d6482b]">
                    ₹{winner.bidAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* No Bids Message for Ended Auctions */}
            {isEnded && !winner && totalBids === 0 && (
              <div className="mb-2 p-1.5 bg-gray-50 rounded border border-gray-200">
                <p className="text-[9px] text-gray-500 text-center">
                  No bids placed
                </p>
              </div>
            )}

            {/* Action Buttons - Compact */}
            <div className="grid grid-cols-3 gap-1 mt-2">
              <Link
                to={`/auction/details/${id}`}
                className="flex items-center justify-center p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                title="View Details"
              >
                <EyeIcon className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleDeleteAuction}
                className="flex items-center justify-center p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                title="Delete Auction"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>

              {isEnded && (
                <button
                  onClick={() => setOpenDrawer(true)}
                  className="flex items-center justify-center p-1.5 bg-sky-50 text-sky-500 rounded hover:bg-sky-100 transition-colors"
                  title="Republish Auction"
                >
                  <ArrowPathIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Time Remaining - Compact */}
            <div className="mt-2 flex items-center justify-between text-[9px] text-gray-500">
              <div className="flex items-center gap-0.5">
                <ClockIcon className="w-2.5 h-2.5" />
                <span>
                  {isUpcoming && "Starts"}
                  {isLive && "Ends"}
                  {isEnded && "Ended"}
                </span>
              </div>
              <span className="font-medium">
                {!isEnded ? (
                  <>
                    {isUpcoming && new Date(startTime).toLocaleDateString()}
                    {isLive && new Date(endTime).toLocaleDateString()}
                  </>
                ) : (
                  new Date(endTime).toLocaleDateString()
                )}
              </span>
            </div>

            {/* Toggle Details Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-center gap-0.5 text-[9px] text-gray-400 hover:text-[#d6482b] transition-colors mt-1.5"
            >
              {showDetails ? (
                <>
                  Less <ChevronUpIcon className="w-2.5 h-2.5" />
                </>
              ) : (
                <>
                  More <ChevronDownIcon className="w-2.5 h-2.5" />
                </>
              )}
            </button>

            {/* Expanded Details */}
            {showDetails && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-[9px] space-y-1 max-h-24 overflow-y-auto">
                <div className="flex justify-between">
                  <span className="text-gray-500">Start:</span>
                  <span className="font-medium">
                    {new Date(startTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">End:</span>
                  <span className="font-medium">
                    {new Date(endTime).toLocaleString()}
                  </span>
                </div>
                {bids.length > 0 && (
                  <>
                    <div className="border-t border-gray-200 my-1"></div>
                    <p className="font-semibold text-gray-600 text-[8px] mb-1">
                      Recent Bids:
                    </p>
                    {bids
                      .slice(-3)
                      .reverse()
                      .map((bid, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span className="truncate max-w-[60px] text-gray-600">
                            {bid.userName}
                          </span>
                          <span className="font-semibold">
                            ₹{bid.bidAmount?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Republish Drawer */}
        <Drawer
          id={id}
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          title={title}
        />
      </>
    );
  }

  // Original non-compact version would go here if needed
  return null;
};

export default CardTwo;

// Enhanced Drawer Component
const Drawer = ({ setOpenDrawer, openDrawer, id, title }) => {
  const dispatch = useDispatch();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [errors, setErrors] = useState({});
  const { loading } = useSelector((state) => state.auction);

  const validateForm = () => {
    const newErrors = {};

    if (!startTime) {
      newErrors.startTime = "Start time is required";
    }
    if (!endTime) {
      newErrors.endTime = "End time is required";
    }
    if (startTime && endTime && startTime >= endTime) {
      newErrors.timeRange = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRepublishAuction = () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("startTime", startTime.toISOString());
    formData.append("endTime", endTime.toISOString());

    dispatch(republishAuction(id, formData)).then(() => {
      setOpenDrawer(false);
      setStartTime(null);
      setEndTime(null);
      setErrors({});
    });
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 transition-all duration-300 z-50 ${
        openDrawer ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={() => setOpenDrawer(false)}
    >
      <div
        className={`absolute bottom-0 left-0 w-full bg-white rounded-t-2xl transform transition-transform duration-300 ${
          openDrawer ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-lg mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#d6482b]">
                Republish Auction
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Set new dates for "
                {title.length > 30 ? title.substring(0, 30) + "..." : title}"
              </p>
            </div>
            <button
              onClick={() => setOpenDrawer(false)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form className="space-y-4">
            {/* Start Time */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={startTime}
                onChange={(date) => {
                  setStartTime(date);
                  setErrors({ ...errors, startTime: null, timeRange: null });
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMM d, yyyy h:mm aa"
                minDate={new Date()}
                placeholderText="Select start time"
                className={`w-full px-3 py-2 text-sm border ${
                  errors.startTime
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-[#d6482b] focus:border-transparent outline-none`}
                required
              />
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={endTime}
                onChange={(date) => {
                  setEndTime(date);
                  setErrors({ ...errors, endTime: null, timeRange: null });
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMM d, yyyy h:mm aa"
                minDate={startTime || new Date()}
                placeholderText="Select end time"
                className={`w-full px-3 py-2 text-sm border ${
                  errors.endTime
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-[#d6482b] focus:border-transparent outline-none`}
                required
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
              )}
            </div>

            {/* Time Range Error */}
            {errors.timeRange && (
              <p className="text-red-500 text-xs">{errors.timeRange}</p>
            )}

            {/* Duration Preview */}
            {startTime && endTime && !errors.timeRange && (
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-xs text-blue-700">
                  Duration:{" "}
                  {Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24))}{" "}
                  days
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={handleRepublishAuction}
                disabled={loading}
                className="flex-1 bg-[#d6482b] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#b33a22] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Republish Auction"
                )}
              </button>
              <button
                type="button"
                onClick={() => setOpenDrawer(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
