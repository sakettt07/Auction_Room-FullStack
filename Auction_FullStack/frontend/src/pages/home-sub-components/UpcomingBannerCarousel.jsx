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
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const FALLBACK_BANNERS = [
  {
    _id: "spotlight-1",
    isCurated: true,
    title: "Heritage Luxury Timepieces & Vintage Chronographs",
    description:
      "Exclusive collection curated by Super Admin. Rare Patek Philippe, Rolex Daytona, and Audemars Piguet going live for bidding soon.",
    category: "Watches & Luxury",
    condition: "Mint Condition",
    startingPrice: 125000,
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    itemImage: {
      url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    },
    badge: "Super Admin Spotlight",
  },
  {
    _id: "spotlight-2",
    isCurated: true,
    title: "Rare Contemporary Art & Signed Canvas Masterpieces",
    description:
      "Verified gallery-grade pieces with complete provenance and authentication certificates. Zero buyer premiums on early bids.",
    category: "Fine Art",
    condition: "Original Artwork",
    startingPrice: 85000,
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 54).toISOString(),
    itemImage: {
      url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80",
    },
    badge: "Upcoming Gala Drop",
  },
  {
    _id: "spotlight-3",
    isCurated: true,
    title: "Collector's Vintage Speedsters & Classic Automobilia",
    description:
      "Historic racing memorabilia, limited edition diecasts, and collector vehicle parts ready for live bidding.",
    category: "Automotive & Memorabilia",
    condition: "Excellent",
    startingPrice: 240000,
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 78).toISOString(),
    itemImage: {
      url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    },
    badge: "Super Admin Exclusive",
  },
];

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

  // Filter real upcoming auctions from DB
  const upcomingRealAuctions = allAuctions
    .filter((a) => a.startTime && new Date(a.startTime) > now)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  // Merge Super Admin dynamic banners, real upcoming auctions, and curated fallbacks
  const dynamicBanners = (activeBanners || []).map((b) => ({
    ...b,
    isDynamic: true,
  }));

  const combinedSlides = [
    ...dynamicBanners,
    ...upcomingRealAuctions.map((item) => ({
      ...item,
      badge: "Upcoming Live Drop",
    })),
    ...FALLBACK_BANNERS,
  ];

  // De-duplicate by ID and limit to 6 slides max
  const seenIds = new Set();
  const slides = combinedSlides.filter((slide) => {
    if (!slide._id || seenIds.has(slide._id)) return false;
    seenIds.add(slide._id);
    return true;
  }).slice(0, 6);

  const totalSlides = slides.length;

  // Auto-move carousel every 3 seconds (3000ms)
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, isPaused]);

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

  const currentSlide = slides[currentIndex];
  const countdown = formatCountdown(currentSlide.startTime);

  return (
    <section
      className="relative w-full rounded-3xl overflow-hidden bg-white border border-stone-200/80 shadow-xl shadow-stone-200/40"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Banner Tag */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 text-[#D6482B] shadow-sm backdrop-blur-md border border-[#D6482B]/20">
          <SparklesIcon className="w-3.5 h-3.5 text-[#D6482B]" />
          {currentSlide.badge || "Upcoming Auction"}
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-900/70 text-white backdrop-blur-md">
          <ClockIcon className="w-3.5 h-3.5 text-amber-300" />
          Auto-updates every 3s
        </span>

        {user?.role === "Super Admin" && (
          <Link
            to="/dashboard"
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#D6482B] hover:bg-[#b33a22] text-white backdrop-blur-md shadow-sm transition"
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
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight mb-3 transition-all duration-300">
              {currentSlide.title}
            </h3>

            <p className="text-stone-600 text-sm sm:text-base line-clamp-2 md:line-clamp-3 mb-6 max-w-xl">
              {currentSlide.description ||
                "Don't miss this upcoming high-demand auction. Verified authenticity, transparent bidding, and secure escrow guarantee."}
            </p>
          </div>

          {/* Pricing & Countdown Row */}
          <div className="flex flex-wrap items-end gap-6 pt-4 border-t border-stone-100">
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1">
                Starting Bid
              </p>
              <p className="text-2xl sm:text-3xl font-black text-[#D6482B]">
                ₹{currentSlide.startingPrice?.toLocaleString() || "0"}
              </p>
            </div>

            {/* Live Countdown Box */}
            <div className="flex items-center gap-2 bg-stone-50/90 border border-stone-200/80 rounded-2xl px-4 py-2">
              <div className="text-center">
                <span className="text-lg font-black text-stone-900 block leading-none">
                  {String(countdown.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase font-semibold text-stone-500">
                  Days
                </span>
              </div>
              <span className="text-stone-400 font-bold mb-2">:</span>
              <div className="text-center">
                <span className="text-lg font-black text-stone-900 block leading-none">
                  {String(countdown.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase font-semibold text-stone-500">
                  Hrs
                </span>
              </div>
              <span className="text-stone-400 font-bold mb-2">:</span>
              <div className="text-center">
                <span className="text-lg font-black text-stone-900 block leading-none">
                  {String(countdown.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase font-semibold text-stone-500">
                  Min
                </span>
              </div>
              <span className="text-stone-400 font-bold mb-2">:</span>
              <div className="text-center">
                <span className="text-lg font-black text-[#D6482B] block leading-none">
                  {String(countdown.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase font-semibold text-stone-500">
                  Sec
                </span>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="flex-1 min-w-[140px]">
              {currentSlide.isDynamic ? (
                <Link
                  to={
                    currentSlide.ctaLink ||
                    (currentSlide.auctionItem?._id
                      ? `/auction/item/${currentSlide.auctionItem._id}`
                      : "/auctions")
                  }
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-md shadow-orange-500/20 hover:shadow-lg transition-all"
                >
                  <span>{currentSlide.ctaText || "Explore Upcoming"}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              ) : currentSlide.isCurated ? (
                <Link
                  to="/auctions"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-md shadow-orange-500/20 hover:shadow-lg transition-all"
                >
                  <span>Explore Upcoming</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to={`/auction/item/${currentSlide._id}`}
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-md shadow-orange-500/20 hover:shadow-lg transition-all"
                >
                  <span>View Details</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              )}
            </div>
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
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md border border-stone-200/80 hover:scale-110 transition-all"
      >
        <ChevronLeftIcon className="w-5 h-5 text-stone-700" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md border border-stone-200/80 hover:scale-110 transition-all"
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
            className={`h-2 rounded-full transition-all duration-300 ${
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
