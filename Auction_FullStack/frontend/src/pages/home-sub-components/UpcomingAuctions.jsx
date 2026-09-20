import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ClockIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  SparklesIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

const UpcomingAuctions = () => {
  const { allAuctions = [] } = useSelector((state) => state.auction);
  const now = new Date();
  const todayStr = now.toDateString();

  // Look for auctions starting today
  let displayAuctions = allAuctions.filter((item) => {
    return item.startTime && new Date(item.startTime).toDateString() === todayStr;
  });

  // If no auctions start strictly today, show upcoming auctions starting soonest
  const isFallbackUpcoming = displayAuctions.length === 0;
  if (isFallbackUpcoming) {
    displayAuctions = allAuctions
      .filter((item) => item.startTime && new Date(item.startTime) > now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 3);
  } else {
    displayAuctions = displayAuctions.slice(0, 3);
  }

  // Format time nicely
  const formatTimeStr = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/60 mb-2">
            <CalendarDaysIcon className="w-3.5 h-3.5 text-amber-600" />
            {isFallbackUpcoming ? "Upcoming Schedule" : "Scheduled For Today"}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            {isFallbackUpcoming ? "Upcoming Drops Soon" : "Auctions Starting Today"}
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-1">
            Get your watchlist ready. Pre-bid and join the countdown before the hammer drops.
          </p>
        </div>

        <Link
          to="/auctions"
          className="inline-flex items-center gap-1 text-sm font-bold text-[#D6482B] hover:text-[#b33a22] transition-colors group"
        >
          <span>See Full Schedule</span>
          <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Highlight Feature Card */}
        <div className="rounded-2xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#D6482B] via-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/20">
          <div>
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-inner">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>

            <p className="text-xs uppercase font-bold tracking-widest text-orange-100 mb-1">
              Live Countdown
            </p>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white mb-2">
              {isFallbackUpcoming ? "Upcoming" : "Today's"} <br />Drops
            </h3>
            <p className="text-orange-50/90 text-sm leading-relaxed mt-2">
              All bids are tracked in real-time. Highest bidder when timer hits zero wins the lot.
            </p>
          </div>

          <div className="pt-6">
            <Link
              to="/auctions"
              className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-[#D6482B] hover:bg-orange-50 shadow-md transition-all"
            >
              Explore Calendar
            </Link>
          </div>
        </div>

        {/* Auction Cards */}
        {displayAuctions.length > 0 ? (
          displayAuctions.map((auction) => (
            <Link
              to={`/auction/item/${auction._id}`}
              key={auction._id}
              className="bg-white rounded-2xl border border-stone-200/80 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="h-44 bg-stone-100 overflow-hidden relative">
                <img
                  src={auction.itemImage?.url || "/placeholder_image.jpg"}
                  alt={auction.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-stone-800 shadow-sm border border-stone-200">
                    Starts {formatTimeStr(auction.startTime)}
                  </span>
                </div>
                {auction.category && (
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-900/80 text-white backdrop-blur-sm">
                    {auction.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 line-clamp-2 mb-3 group-hover:text-[#D6482B] transition-colors">
                    {auction.title}
                  </h4>

                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center justify-between mb-3">
                    <span className="text-xs text-stone-500 font-medium">Starting At</span>
                    <span className="text-base font-black text-[#D6482B]">
                      ₹{auction.startingPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium">Date:</span>
                  <span className="font-semibold text-stone-700">
                    {new Date(auction.startTime).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="sm:col-span-3 flex items-center justify-center p-8 bg-white rounded-2xl border border-stone-200/80 text-stone-500 text-center">
            <div>
              <SparklesIcon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-semibold text-stone-700">No scheduled auctions starting today</p>
              <p className="text-xs text-stone-400 mt-1">Check the Featured Auctions above or create a new auction.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingAuctions;
