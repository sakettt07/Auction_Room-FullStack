import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchActiveBanners } from "@/store/slices/bannerSlice";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  SparklesIcon,
  TagIcon,
  FireIcon,
  ArrowRightIcon,
  TrophyIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const UpcomingBannerCarousel = () => {
  const dispatch = useDispatch();
  const { allAuctions = [] } = useSelector((state) => state.auction);
  const { activeBanners = [] } = useSelector((state) => state.banner);
  const { user } = useSelector((state) => state.user);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [now, setNow] = useState(new Date());
  const timerRef = useRef(null);

  // Fetch dynamic active banners on mount
  useEffect(() => {
    dispatch(fetchActiveBanners());
  }, [dispatch]);

  // Update clock every second for live countdown
  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  // Filter real live/upcoming auctions from DB as fallback ONLY if no dynamic banners exist
  const realLiveOrUpcoming = allAuctions
    .filter((a) => a.startTime && (!a.endTime || new Date(a.endTime) > now))
    .slice(0, 6)
    .map((item) => {
      const isLiveNow = new Date(item.startTime) <= now;
      return {
        ...item,
        badge: isLiveNow ? "HOT LIVE AUCTION" : "UPCOMING LIVE DROP",
        bannerType: isLiveNow ? "Live Hot" : "Upcoming",
        currentBid: item.currentPrice,
        totalBids: item.bids?.length || 0,
        isDynamic: false,
      };
    });

  // Prepare slides - Super Admin dynamic banners prioritized, no mock stock banners
  const dynamicBanners = (activeBanners || []).map((b) => ({
    ...b,
    isDynamic: true,
  }));

  const combinedSlides = dynamicBanners.length > 0 ? dynamicBanners : realLiveOrUpcoming;

  // De-duplicate by ID and limit to 8 slides max
  const seenIds = new Set();
  const slides = combinedSlides.filter((slide) => {
    if (!slide._id || seenIds.has(slide._id)) return false;
    seenIds.add(slide._id);
    return true;
  }).slice(0, 8);

  const totalSlides = slides.length;

  // Auto-move carousel every 3.5 seconds
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 3500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, isPaused]);

  // Keep index within range if slides change
  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [totalSlides, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const formatCountdown = (targetDateStr) => {
    if (!targetDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const diff = Math.max(0, new Date(targetDateStr).getTime() - now.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  if (totalSlides === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  // Cross-reference live auction from allAuctions in Redux for real-time bids & timing accuracy
  const matchedAuction = allAuctions.find((a) => {
    if (!a) return false;
    if (
      currentSlide.auctionItem &&
      (a._id === currentSlide.auctionItem._id ||
        a._id === currentSlide.auctionItem)
    )
      return true;
    if (currentSlide._id && a._id === currentSlide._id) return true;
    if (
      currentSlide.title &&
      a.title &&
      a.title.trim().toLowerCase() === currentSlide.title.trim().toLowerCase()
    )
      return true;
    return false;
  });

  // Resolve timing and status states
  const startTime = matchedAuction?.startTime
    ? new Date(matchedAuction.startTime)
    : currentSlide.startTime
    ? new Date(currentSlide.startTime)
    : null;

  const endTime = matchedAuction?.endTime
    ? new Date(matchedAuction.endTime)
    : currentSlide.endTime
    ? new Date(currentSlide.endTime)
    : null;

  const isCompleted =
    currentSlide.bannerType === "Completed" ||
    (endTime && endTime <= now && currentSlide.bannerType !== "Upcoming") ||
    Boolean(currentSlide.winnerName && currentSlide.bannerType !== "Live Hot");

  const isLive =
    !isCompleted &&
    ((startTime && startTime <= now && (!endTime || endTime > now)) ||
      currentSlide.bannerType === "Live Hot");

  const isUpcoming = !isCompleted && !isLive;

  // Resolve target date for countdown
  const targetCountdownDate = isLive ? endTime : startTime;
  const countdown = formatCountdown(targetCountdownDate);
  const countdownLabel = isLive ? "Bidding Closes In" : "Bidding Opens In";

  // Resolve Pricing and Bids accurately
  const startingPrice = Number(
    matchedAuction?.startingPrice ||
      currentSlide.startingPrice ||
      currentSlide.auctionItem?.startingPrice ||
      0
  );

  const currentBid = Number(
    matchedAuction?.currentPrice ||
      currentSlide.currentBid ||
      currentSlide.auctionItem?.currentPrice ||
      startingPrice
  );

  // Resolve true total bids count
  let resolvedBids = 0;
  if (matchedAuction && Array.isArray(matchedAuction.bids) && matchedAuction.bids.length > 0) {
    resolvedBids = matchedAuction.bids.length;
  } else if (
    currentSlide.auctionItem &&
    Array.isArray(currentSlide.auctionItem.bids) &&
    currentSlide.auctionItem.bids.length > 0
  ) {
    resolvedBids = currentSlide.auctionItem.bids.length;
  } else if (currentSlide.totalBids && Number(currentSlide.totalBids) > 0) {
    resolvedBids = Number(currentSlide.totalBids);
  }

  // If current price is strictly higher than starting price, at least 1 bid was placed
  if (resolvedBids === 0 && currentBid > startingPrice) {
    resolvedBids = 1;
  }

  const totalBids = resolvedBids;
  const hasActiveBids = currentBid > startingPrice || totalBids > 0;

  // Resolve Winner Information
  const winnerName =
    currentSlide.winnerName ||
    matchedAuction?.highestBidder?.userName ||
    currentSlide.auctionItem?.highestBidder?.userName ||
    (matchedAuction?.bids?.length > 0
      ? matchedAuction.bids[matchedAuction.bids.length - 1]?.userName
      : currentSlide.auctionItem?.bids?.length > 0
      ? currentSlide.auctionItem.bids[currentSlide.auctionItem.bids.length - 1]?.userName
      : "");

  const winningPrice = Number(
    currentSlide.winningPrice || currentBid || startingPrice
  );

  // CTA link target
  const lotTargetLink =
    currentSlide.ctaLink ||
    (matchedAuction?._id
      ? `/auction/item/${matchedAuction._id}`
      : currentSlide.auctionItem?._id
      ? `/auction/item/${currentSlide.auctionItem._id}`
      : currentSlide._id
      ? `/auction/item/${currentSlide._id}`
      : "/auctions");

  return (
    <section
      className="relative w-full rounded-3xl overflow-hidden bg-white border border-stone-200/80 shadow-xl shadow-stone-200/40"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Banner Tag & Admin Shortcut */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-sm border ${
            isCompleted
              ? "bg-amber-500/90 text-white border-amber-400/50"
              : isLive
              ? "bg-emerald-600/90 text-white border-emerald-400/50"
              : "bg-white/90 text-[#D6482B] border-[#D6482B]/20"
          }`}
        >
          {isCompleted ? (
            <TrophyIcon className="w-3.5 h-3.5 text-white" />
          ) : isLive ? (
            <FireIcon className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          ) : (
            <SparklesIcon className="w-3.5 h-3.5 text-[#D6482B]" />
          )}
          {currentSlide.badge ||
            (isCompleted
              ? "AUCTION CONCLUDED • WINNER SPOTLIGHT"
              : isLive
              ? "HOT LIVE AUCTION"
              : "UPCOMING AUCTION")}
        </span>

        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-900/70 text-white backdrop-blur-md">
          <ClockIcon className="w-3.5 h-3.5 text-amber-300" />
          Auto-updates every 3s
        </span>

        {user?.role === "Super Admin" && (
          <Link
            to="/dashboard"
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#D6482B] hover:bg-[#b33a22] text-white backdrop-blur-md shadow-sm transition cursor-pointer"
            title="Manage dynamic banners in Admin Dashboard"
          >
            <FireIcon className="w-3 h-3" />
            <span>Manage Banners</span>
          </Link>
        )}
      </div>

      {/* Slide Container */}
      <div className="relative min-h-[420px] md:min-h-[440px] flex flex-col md:flex-row items-center justify-between">
        {/* Left Content Area */}
        <div className="z-10 w-full md:w-7/12 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
          <div className="pt-6 md:pt-2">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {currentSlide.category && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  <TagIcon className="w-3 h-3 text-stone-500" />
                  {currentSlide.category}
                </span>
              )}
              {currentSlide.condition && (
                <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60">
                  {currentSlide.condition}
                </span>
              )}
              {isLive && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Bidding
                </span>
              )}
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-300">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-amber-600" />
                  Hammer Dropped
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight mb-3 transition-all duration-300">
              {currentSlide.title}
            </h3>

            <p className="text-stone-600 text-sm sm:text-base line-clamp-2 md:line-clamp-3 mb-6 max-w-xl leading-relaxed">
              {currentSlide.description ||
                "Verified authentic lot with complete documentation and certified provenance. Transparent bidding and secure escrow guarantee."}
            </p>
          </div>

          {/* Pricing & Status Row - Stable Non-Shifting Layout */}
          <div className="pt-4 border-t border-stone-100">
            
            {/* CASE 1: CONCLUDED / COMPLETED AUCTION SHOWCASE */}
            {isCompleted ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Winning Hammer Price */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-0.5">
                      Winning Hammer Price
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-amber-600">
                      ₹{winningPrice.toLocaleString("en-IN")}
                    </p>
                    {startingPrice > 0 && (
                      <span className="text-[11px] text-stone-400 font-medium">
                        Started at ₹{startingPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Winner Spotlight Box */}
                  <div className="flex-1 max-w-sm flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl px-4 py-2.5 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-xs flex-shrink-0">
                      <TrophyIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-black text-amber-900 tracking-wider block">
                        Auction Won By
                      </span>
                      <p className="text-xs sm:text-sm font-black text-stone-900 truncate">
                        {winnerName ? `@${winnerName}` : "Verified Winning Bidder"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center gap-3 pt-1">
                  <Link
                    to={lotTargetLink}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-stone-900 hover:bg-stone-800 shadow-md transition cursor-pointer"
                  >
                    <span>{currentSlide.ctaText || "View Concluded Lot"}</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                  <div className="flex items-center gap-1 text-stone-400 text-xs font-medium">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                    <span>Transaction Verified</span>
                  </div>
                </div>
              </div>
            ) : (
              /* CASE 2 & 3: LIVE OR UPCOMING AUCTION - ROCK SOLID 2-ROW ARCHITECTURE */
              <div className="space-y-4">
                {/* Row 1: Metrics - Price & Fixed-Width Timer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-between">
                  {/* Left: Price & Bid Count */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs uppercase tracking-wider text-emerald-700 font-bold">
                        {hasActiveBids ? "Current Highest Bid" : "Starting Bid"}
                      </p>
                      {totalBids > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-orange-100 text-[#D6482B] border border-orange-200">
                          <FireIcon className="w-3 h-3" />
                          {totalBids} {totalBids === 1 ? "bid" : "bids"}
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold">
                          Be the first bidder!
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl sm:text-3xl font-black text-[#D6482B] tracking-tight">
                        ₹{currentBid.toLocaleString("en-IN")}
                      </p>
                      {startingPrice > 0 && currentBid > startingPrice && (
                        <span className="text-xs text-stone-400 font-semibold line-through">
                          Starting: ₹{startingPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Real-Time Live Countdown Box with Fixed Digit Widths */}
                  <div className="flex flex-col items-start sm:items-end gap-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 flex items-center gap-1.5">
                      {isLive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                      {countdownLabel}
                    </span>
                    
                    <div className="flex items-center gap-1.5 bg-stone-50/95 border border-stone-200/90 rounded-2xl px-3.5 py-2 font-mono tabular-nums shadow-xs">
                      <div className="text-center w-7 sm:w-8">
                        <span className="text-base sm:text-lg font-black text-stone-900 block leading-none">
                          {String(countdown.days).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase font-semibold text-stone-400 font-sans">
                          Days
                        </span>
                      </div>
                      <span className="text-stone-300 font-bold mb-2">:</span>
                      <div className="text-center w-7 sm:w-8">
                        <span className="text-base sm:text-lg font-black text-stone-900 block leading-none">
                          {String(countdown.hours).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase font-semibold text-stone-400 font-sans">
                          Hrs
                        </span>
                      </div>
                      <span className="text-stone-300 font-bold mb-2">:</span>
                      <div className="text-center w-7 sm:w-8">
                        <span className="text-base sm:text-lg font-black text-stone-900 block leading-none">
                          {String(countdown.minutes).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase font-semibold text-stone-400 font-sans">
                          Min
                        </span>
                      </div>
                      <span className="text-stone-300 font-bold mb-2">:</span>
                      <div className="text-center w-7 sm:w-8">
                        <span className="text-base sm:text-lg font-black text-[#D6482B] block leading-none">
                          {String(countdown.seconds).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase font-semibold text-stone-400 font-sans">
                          Sec
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Action Button & Trust Guarantee */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    to={lotTargetLink}
                    className={`inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all cursor-pointer ${
                      isLive
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/20"
                        : "bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-orange-500/20"
                    }`}
                  >
                    <span>
                      {currentSlide.ctaText || (isLive ? "Bid Live Now" : "Explore Upcoming")}
                    </span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center gap-1.5 text-stone-400 text-xs font-medium">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                    <span>Verified Authentic • Escrow Protected</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Image Showcase with Depth Gradient */}
        <div className="relative w-full md:w-5/12 h-64 md:h-[440px] overflow-hidden bg-stone-100 flex items-center justify-center">
          <img
            key={currentSlide._id}
            src={currentSlide.itemImage?.url || "/placeholder_image.jpg"}
            alt={currentSlide.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-all duration-700"
          />
          {/* Soft gradient masks for visual blending */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-transparent to-transparent opacity-80 md:opacity-90"></div>
          
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-800 shadow-sm border border-stone-200">
            {currentIndex + 1} / {totalSlides}
          </div>
        </div>
      </div>

      {/* Navigation Chevrons */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md border border-stone-200/80 hover:scale-110 transition-all cursor-pointer"
      >
        <ChevronLeftIcon className="w-5 h-5 text-stone-700" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md border border-stone-200/80 hover:scale-110 transition-all cursor-pointer"
      >
        <ChevronRightIcon className="w-5 h-5 text-stone-700" />
      </button>

      {/* Indicators Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx
                ? "w-8 bg-[#D6482B]"
                : "w-2 bg-stone-300 hover:bg-stone-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default UpcomingBannerCarousel;
