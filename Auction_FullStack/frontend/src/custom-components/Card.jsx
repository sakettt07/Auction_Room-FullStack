import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Card = ({
  imgSrc,
  title,
  startingBid,
  currentBid,
  startTime,
  endTime,
  id,
  bids,
  viewMode = "grid",
}) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const start = startTime ? new Date(startTime) : null;
    const end = endTime ? new Date(endTime) : null;

    const startDiff = start ? start.getTime() - now.getTime() : 0;
    const endDiff = end ? end.getTime() - now.getTime() : 0;

    if (startDiff > 0) {
      return {
        type: "Starts In",
        time: startDiff,
      };
    }

    if (endDiff > 0) {
      return {
        type: "Ends In",
        time: endDiff,
      };
    }

    return { type: "Ended", time: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);

    const pad = (n) => String(n).padStart(2, "0");

    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const now = new Date();
  const start = startTime ? new Date(startTime) : null;
  const end = endTime ? new Date(endTime) : null;

  const status =
    start && now < start ? "Upcoming" : end && now > end ? "Ended" : "Live";

  const statusColor =
    status === "Live"
      ? "bg-green-500"
      : status === "Upcoming"
        ? "bg-blue-500"
        : "bg-gray-500";

  const highestBid = bids?.length
    ? Math.max(...bids.map((b) => b.bidAmount))
    : startingBid;

  const safeImgSrc = imgSrc || "/placeholder-auction.png";
  const safeTitle = title || "Auction item";

  // Determine the bid label based on auction status
  const getBidLabel = () => {
    if (status === "Upcoming") {
      return "Minimum Bid";
    } else if (status === "Live") {
      return "Last Bid";
    } else if (status === "Ended") {
      return "Winning Bid";
    }
    return "Current Bid"; // fallback
  };

  // Determine the bid amount to display
  const getBidAmount = () => {
    if (status === "Upcoming") {
      return startingBid; // Show starting bid for upcoming auctions
    } else if (status === "Live") {
      return currentBid || startingBid; // Show current/last bid for live auctions
    } else if (status === "Ended") {
      return currentBid || startingBid; // Show winning bid for ended auctions
    }
    return currentBid || startingBid;
  };

  const bidLabel = getBidLabel();
  const bidAmount = getBidAmount();

  // List view layout
  if (viewMode === "list") {
    return (
      <Link
        to={`/auction/item/${id}`}
        className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group flex flex-col sm:flex-row w-full"
      >
        <div className="relative sm:w-48 md:w-64 flex-shrink-0">
          <img
            src={safeImgSrc}
            alt={safeTitle}
            className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition duration-300"
          />

          <span
            className={`absolute top-3 left-3 text-white text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}
          >
            {status}
          </span>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-[#d6482b] transition-colors line-clamp-1">
              {safeTitle}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-500">Starting Bid</p>
                <p className="text-lg font-bold text-[#d6482b]">
                  ₹{startingBid?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{bidLabel}</p>
                <p
                  className={`font-semibold ${
                    status === "Ended" ? "text-green-600" : ""
                  }`}
                >
                  ₹{bidAmount?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 mt-2 pt-2 border-t border-gray-100">
            <span className="font-medium">{timeLeft.type}</span>
            <span className="font-semibold text-[#d6482b]">
              {timeLeft.type !== "Ended"
                ? formatTime(timeLeft.time)
                : "Auction Finished"}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view layout - Equal height cards
  return (
    <Link
      to={`/auction/item/${id}`}
      className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group flex flex-col h-full w-full"
    >
      <div className="relative flex-shrink-0">
        <img
          src={safeImgSrc}
          alt={safeTitle}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
        />

        <span
          className={`absolute top-3 left-3 text-white text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}
        >
          {status}
        </span>

        {/* Additional badge for ended auctions with winner */}
        {status === "Ended" && bids?.length > 0 && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-xs px-2 py-1 rounded-full font-medium text-yellow-900">
            🏆 Sold
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-[#d6482b] transition-colors line-clamp-2 min-h-[3.5rem]">
          {safeTitle}
        </h3>

        <div className="space-y-2 mb-3">
          <div>
            <p className="text-xs text-gray-500">Starting Bid</p>
            <p className="text-lg font-bold text-[#d6482b]">
              ₹{startingBid?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">{bidLabel}</p>
            <p
              className={`font-semibold ${
                status === "Ended" ? "text-green-600 text-lg" : ""
              }`}
            >
              ₹{bidAmount?.toLocaleString()}
              {status === "Ended" && bids?.length > 0 && (
                <span className="ml-2 text-xs text-green-500">(Won)</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t border-gray-100">
            <span className="font-medium flex items-center gap-1">
              {status === "Live" && (
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              )}
              {timeLeft.type}
            </span>
            <span className="font-semibold text-[#d6482b]">
              {timeLeft.type !== "Ended"
                ? formatTime(timeLeft.time)
                : "Auction Finished"}
            </span>
          </div>

          {/* Bid count indicator for live auctions */}
          {status === "Live" && bids?.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {bids.length} {bids.length === 1 ? "bid" : "bids"} placed
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Card;
