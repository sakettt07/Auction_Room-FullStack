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
  category,
  condition,
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
      ? "bg-emerald-500 text-white shadow-sm"
      : status === "Upcoming"
        ? "bg-blue-600 text-white shadow-sm"
        : "bg-stone-500 text-white";

  const safeImgSrc = imgSrc || "/placeholder_image.jpg";
  const safeTitle = title || "Auction item";

  // Determine the bid label based on auction status
  const getBidLabel = () => {
    if (status === "Upcoming") {
      return "Reserve / Min Bid";
    } else if (status === "Live") {
      return "Current Bid";
    } else if (status === "Ended") {
      return "Winning Bid";
    }
    return "Current Bid";
  };

  // Determine the bid amount to display
  const getBidAmount = () => {
    if (status === "Upcoming") {
      return startingBid;
    } else if (status === "Live") {
      return currentBid || startingBid;
    } else if (status === "Ended") {
      return currentBid || startingBid;
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
        className="bg-white rounded-2xl border border-stone-200/80 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col sm:flex-row w-full"
      >
        <div className="relative sm:w-52 md:w-64 flex-shrink-0 bg-stone-100 overflow-hidden">
          <img
            src={safeImgSrc}
            alt={safeTitle}
            className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <span
            className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-md ${statusColor}`}
          >
            {status === "Live" && (
              <span className="inline-block w-2 h-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
            )}
            {status}
          </span>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {category && (
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                  {category}
                </span>
              )}
              {condition && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60">
                  {condition}
                </span>
              )}
            </div>

            <h3 className="font-bold text-lg text-stone-900 group-hover:text-[#D6482B] transition-colors line-clamp-1 mb-3">
              {safeTitle}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Starting Bid</p>
                <p className="text-base font-bold text-stone-700">
                  ₹{startingBid?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">{bidLabel}</p>
                <p
                  className={`text-lg font-black ${
                    status === "Ended" ? "text-emerald-600" : "text-[#D6482B]"
                  }`}
                >
                  ₹{bidAmount?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-stone-500 mt-2 pt-3 border-t border-stone-100">
            <span className="font-semibold text-stone-700">{timeLeft.type}</span>
            <span className="font-bold text-[#D6482B]">
              {timeLeft.type !== "Ended"
                ? formatTime(timeLeft.time)
                : "Auction Finished"}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view layout - Equal height luxury cards
  return (
    <Link
      to={`/auction/item/${id}`}
      className="bg-white rounded-2xl border border-stone-200/80 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full w-full transform hover:-translate-y-1"
    >
      <div className="relative flex-shrink-0 bg-stone-100 overflow-hidden">
        <img
          src={safeImgSrc}
          alt={safeTitle}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-md ${statusColor}`}
          >
            {status === "Live" && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse"></span>
            )}
            {status}
          </span>
        </div>

        {/* Condition / Sold badge */}
        {status === "Ended" ? (
          <span
            className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-bold ${
              bids?.length > 0
                ? "bg-amber-400 text-amber-950 shadow-sm"
                : "bg-stone-700 text-white"
            }`}
          >
            {bids?.length > 0 ? "🏆 Sold" : "Unsold"}
          </span>
        ) : condition ? (
          <span className="absolute top-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 border border-stone-200/60 shadow-sm">
            {condition}
          </span>
        ) : null}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {category && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#D6482B] mb-1.5">
              {category}
            </p>
          )}

          <h3 className="font-bold text-base text-stone-900 group-hover:text-[#D6482B] transition-colors line-clamp-2 min-h-[2.75rem] leading-snug mb-3">
            {safeTitle}
          </h3>

          <div className="flex items-baseline justify-between mb-4 bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                {bidLabel}
              </p>
              <p
                className={`text-lg font-black leading-tight ${
                  status === "Ended" ? "text-emerald-600" : "text-[#D6482B]"
                }`}
              >
                ₹{bidAmount?.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                Starts At
              </p>
              <p className="text-xs font-semibold text-stone-600">
                ₹{startingBid?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-stone-100">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-stone-500 flex items-center gap-1.5">
              {timeLeft.type}
            </span>
            <span className="font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md">
              {timeLeft.type !== "Ended"
                ? formatTime(timeLeft.time)
                : "Finished"}
            </span>
          </div>

          {bids?.length > 0 && (
            <div className="mt-2 text-[11px] font-medium text-stone-500 flex items-center justify-between">
              <span>{bids.length} {bids.length === 1 ? "bid placed" : "bids placed"}</span>
              <span className="text-[#D6482B] font-bold group-hover:underline">
                View & Bid →
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Card;
