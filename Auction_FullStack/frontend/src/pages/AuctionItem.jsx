import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  SparklesIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserCircleIcon,
  ChevronRightIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  CheckBadgeIcon,
  FireIcon,
  TrophyIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  TruckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const AuctionItem = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    auctionDetail,
    auctionBidders = [],
  } = useSelector((state) => state.auction);

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [amount, setAmount] = useState("");
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'specs', 'bids', 'guarantee'
  const [now, setNow] = useState(new Date());

  // Update clock every second for live countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const safeStartingPrice = auctionDetail?.startingPrice || 0;

  const highestBid = useMemo(() => {
    if (Array.isArray(auctionBidders) && auctionBidders.length > 0) {
      return Math.max(...auctionBidders.map((b) => b.bidAmount || 0));
    }
    return auctionDetail?.currentPrice || safeStartingPrice;
  }, [auctionBidders, auctionDetail, safeStartingPrice]);

  const totalBids = Array.isArray(auctionBidders) ? auctionBidders.length : 0;

  const startTime = auctionDetail?.startTime ? new Date(auctionDetail.startTime) : null;
  const endTime = auctionDetail?.endTime ? new Date(auctionDetail.endTime) : null;

  const isUpcoming = startTime && now < startTime;
  const isEnded = endTime && now > endTime;
  const isLive = startTime && endTime && now >= startTime && now <= endTime;

  // Countdown calculations
  const calculateCountdown = () => {
    let target = null;
    let label = "";

    if (isUpcoming) {
      target = startTime;
      label = "Bidding Opens In";
    } else if (isLive) {
      target = endTime;
      label = "Bidding Closes In";
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, label: "Auction Concluded" };
    }

    const diff = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, label };
  };

  const countdown = calculateCountdown();

  // Load cached auction details instantly then fetch fresh
  useEffect(() => {
    if (!id) return;
    const cached = localStorage.getItem(`auction_detail_${id}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.time < 5 * 60 * 1000) {
          dispatch({
            type: "auction/getAuctionDetailSuccess",
            payload: parsed.data,
          });
        }
      } catch (e) {
        console.error("Failed to parse cached auction detail", e);
      }
    }
    dispatch(getAuctionDetail(id));
  }, [dispatch, id]);

  const handleBid = (e) => {
    if (e) e.preventDefault();

    if (!isAuthenticated) {
      toast.info("Please login to place bids on this lot.");
      navigateTo("/login");
      return;
    }

    if (user?.role === "Super Admin") {
      toast.error("Super Admins are not permitted to participate in bidding.");
      return;
    }

    if (!amount) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= highestBid) {
      toast.error(`Bid must be strictly higher than current bid (₹${highestBid.toLocaleString()}).`);
      return;
    }

    const formData = new FormData();
    formData.append("amount", numericAmount);

    dispatch(placeBid(id, formData));
    dispatch(getAuctionDetail(id));
    setAmount("");
  };

  const setQuickBid = (increment) => {
    const nextAmount = highestBid + increment;
    setAmount(String(nextAmount));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50/70 via-white to-stone-50/50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 flex flex-col gap-8">
        
        {/* 1. BREADCRUMBS NAVIGATION */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-500 overflow-x-auto no-scrollbar py-1">
          <Link to="/" className="hover:text-[#D6482B] transition-colors">
            Home
          </Link>
          <ChevronRightIcon className="w-3.5 h-3.5 text-stone-300 flex-shrink-0" />
          <Link to="/auctions" className="hover:text-[#D6482B] transition-colors">
            Auctions
          </Link>
          {auctionDetail?.category && (
            <>
              <ChevronRightIcon className="w-3.5 h-3.5 text-stone-300 flex-shrink-0" />
              <span className="text-stone-700 font-bold whitespace-nowrap">
                {auctionDetail.category}
              </span>
            </>
          )}
          <ChevronRightIcon className="w-3.5 h-3.5 text-stone-300 flex-shrink-0" />
          <span className="text-stone-400 font-medium truncate max-w-xs">
            {auctionDetail?.title || "Lot Details"}
          </span>
        </nav>

        {loading && !auctionDetail?._id ? (
          <div className="py-32 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            {/* 2. MAIN LOT SHOWCASE & BIDDING CONSOLE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: IMAGE & GALLERY SHOWCASE (7 COLS) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="relative rounded-3xl bg-white border border-stone-200/80 shadow-lg overflow-hidden group">
                  
                  {/* Status & Condition Badges on Image */}
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                        isLive
                          ? "bg-emerald-500/90 text-white border-emerald-400"
                          : isUpcoming
                          ? "bg-blue-600/90 text-white border-blue-400"
                          : "bg-stone-800/90 text-white border-stone-700"
                      }`}
                    >
                      {isLive && (
                        <span className="inline-block w-2 h-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
                      )}
                      {isLive ? "Live Bidding Active" : isUpcoming ? "Upcoming Lot" : "Auction Concluded"}
                    </span>

                    {auctionDetail?.condition && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 text-stone-800 backdrop-blur-md border border-stone-200/80 shadow-sm">
                        {auctionDetail.condition}
                      </span>
                    )}
                  </div>

                  {/* Fullscreen Expand Trigger */}
                  <button
                    onClick={() => setShowFullscreen(true)}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md border border-stone-200/80 hover:scale-105 transition-all"
                    title="Fullscreen preview"
                  >
                    <ArrowsPointingOutIcon className="w-5 h-5" />
                  </button>

                  {/* High-Resolution Lot Image with Hover Zoom */}
                  <div className="relative w-full h-[400px] sm:h-[480px] bg-stone-50 flex items-center justify-center overflow-hidden cursor-pointer"
                       onClick={() => setShowFullscreen(true)}>
                    <img
                      src={auctionDetail?.itemImage?.url || "/placeholder_image.jpg"}
                      alt={auctionDetail?.title || "Auction item"}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Subtle Footer Bar on Image */}
                  <div className="p-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="font-semibold">Lot # {auctionDetail?._id?.slice(-8) || "—"}</span>
                    <span className="flex items-center gap-1 text-[#D6482B] font-bold">
                      <SparklesIcon className="w-3.5 h-3.5" />
                      Inspected & Verified Lot
                    </span>
                  </div>
                </div>

                {/* Trust & Guarantee Highlights Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm text-center">
                  <div className="p-2">
                    <ShieldCheckIcon className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-stone-900">100% Authentic</p>
                    <p className="text-[10px] text-stone-500">Inspected Provenance</p>
                  </div>
                  <div className="p-2 border-l border-stone-100">
                    <LockClosedIcon className="w-6 h-6 text-[#D6482B] mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-stone-900">Protected Escrow</p>
                    <p className="text-[10px] text-stone-500">Secured Payment</p>
                  </div>
                  <div className="p-2 border-l border-stone-100">
                    <TruckIcon className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-stone-900">Insured Shipping</p>
                    <p className="text-[10px] text-stone-500">Global Tracking</p>
                  </div>
                  <div className="p-2 border-l border-stone-100">
                    <CheckBadgeIcon className="w-6 h-6 text-purple-600 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-stone-900">Zero Buyer Premium</p>
                    <p className="text-[10px] text-stone-500">Transparent Pricing</p>
                  </div>
                </div>
              </div>

              {/* RIGHT: BIDDING & COMMAND CONSOLE (5 COLS) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl shadow-stone-900/5 p-6 sm:p-8 flex flex-col gap-6">
                  
                  {/* Category & Title */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {auctionDetail?.category && (
                        <span className="text-xs font-bold uppercase tracking-wider text-[#D6482B] bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200/60">
                          {auctionDetail.category}
                        </span>
                      )}
                      <span className="text-xs text-stone-400 font-mono">
                        REF: {auctionDetail?._id?.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                      {auctionDetail?.title || "Exclusive Auction Item"}
                    </h1>
                  </div>

                  {/* Live Countdown Clock Box */}
                  <div className="rounded-2xl p-4 bg-stone-50 border border-stone-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4 text-[#D6482B]" />
                        {countdown.label}
                      </span>
                      {isLive && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Real-time
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200/70 shadow-sm">
                        <span className="text-xl sm:text-2xl font-black text-stone-900 block leading-tight">
                          {String(countdown.days).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-stone-400">Days</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200/70 shadow-sm">
                        <span className="text-xl sm:text-2xl font-black text-stone-900 block leading-tight">
                          {String(countdown.hours).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-stone-400">Hours</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200/70 shadow-sm">
                        <span className="text-xl sm:text-2xl font-black text-stone-900 block leading-tight">
                          {String(countdown.minutes).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-stone-400">Mins</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200/70 shadow-sm">
                        <span className="text-xl sm:text-2xl font-black text-[#D6482B] block leading-tight">
                          {String(countdown.seconds).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-stone-400">Secs</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Overview Row */}
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-stone-100">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        Starting Bid
                      </p>
                      <p className="text-lg font-bold text-stone-700 mt-0.5">
                        ₹{safeStartingPrice.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        {isEnded ? "Winning Hammer Bid" : "Current Highest Bid"}
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-[#D6482B] mt-0.5">
                        ₹{highestBid.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Bidding Action Section */}
                  {user?.role === "Super Admin" ? (
                    <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-[#D6482B] flex items-center justify-center mx-auto shadow-sm">
                        <ShieldCheckIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">
                          Super Admin Oversight Mode
                        </h4>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          You are viewing this auction in administrative oversight mode. Live bidding is disabled for Super Admins to protect auction fairness and integrity.
                        </p>
                      </div>
                      <div className="pt-1">
                        <Link
                          to="/dashboard"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#D6482B] bg-white border border-amber-200 hover:bg-amber-100/50 shadow-xs transition"
                        >
                          <span>Open Admin Dashboard</span>
                          <ChevronRightIcon className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ) : isLive ? (
                    <form onSubmit={handleBid} className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                        <span>Place next bid:</span>
                        <span className="text-[#D6482B] font-bold">
                          Minimum: ₹{(highestBid + 1).toLocaleString()}
                        </span>
                      </div>

                      {/* Quick Bid Increment Buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setQuickBid(500)}
                          className="py-2 px-1 rounded-xl text-xs font-bold bg-stone-100 hover:bg-orange-50 hover:text-[#D6482B] text-stone-700 border border-stone-200/60 transition"
                        >
                          +₹500
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickBid(1000)}
                          className="py-2 px-1 rounded-xl text-xs font-bold bg-stone-100 hover:bg-orange-50 hover:text-[#D6482B] text-stone-700 border border-stone-200/60 transition"
                        >
                          +₹1,000
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickBid(5000)}
                          className="py-2 px-1 rounded-xl text-xs font-bold bg-stone-100 hover:bg-orange-50 hover:text-[#D6482B] text-stone-700 border border-stone-200/60 transition"
                        >
                          +₹5,000
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickBid(10000)}
                          className="py-2 px-1 rounded-xl text-xs font-bold bg-stone-100 hover:bg-orange-50 hover:text-[#D6482B] text-stone-700 border border-stone-200/60 transition"
                        >
                          +₹10,000
                        </button>
                      </div>

                      {/* Numeric Input & Submit Button */}
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-base">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder={`Enter amount > ₹${highestBid.toLocaleString()}`}
                          min={highestBid + 1}
                          className="w-full pl-9 pr-4 py-3.5 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] focus:ring-4 focus:ring-orange-500/10 font-bold text-base text-stone-900 transition"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all cursor-pointer"
                      >
                        <ArrowTrendingUpIcon className="w-5 h-5" />
                        <span>Place Live Bid</span>
                      </button>

                      <p className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
                        <LockClosedIcon className="w-3.5 h-3.5 text-stone-400" />
                        All bids are legally binding and protected under escrow.
                      </p>
                    </form>
                  ) : isUpcoming ? (
                    <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-center space-y-3">
                      <p className="text-sm font-bold text-blue-900">
                        ⏳ Bidding has not started yet
                      </p>
                      <p className="text-xs text-blue-700">
                        This lot will go live on{" "}
                        <span className="font-bold">
                          {startTime?.toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        . Check back when the countdown hits zero!
                      </p>
                      <Link
                        to="/auctions"
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 transition shadow-sm"
                      >
                        Explore Other Live Auctions
                      </Link>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-stone-100 border border-stone-200 text-center space-y-2">
                      <p className="text-sm font-bold text-stone-800">
                        🏁 This Auction Has Concluded
                      </p>
                      <p className="text-xs text-stone-500">
                        Final winning bid:{" "}
                        <span className="font-bold text-[#D6482B]">
                          ₹{highestBid.toLocaleString()}
                        </span>{" "}
                        ({totalBids} total bids recorded).
                      </p>
                      <Link
                        to="/auctions"
                        className="inline-block mt-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#D6482B] text-white hover:bg-[#b33a22] transition"
                      >
                        Browse Live Auctions →
                      </Link>
                    </div>
                  )}

                  {/* Total Bids Indicator */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-semibold">
                    <span>Total Bids Recorded:</span>
                    <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-bold">
                      {totalBids} {totalBids === 1 ? "bid" : "bids"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. SEGMENTED DETAILS TABS (Overview, Specifications, Bid History, Escrow) */}
            <section className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-8">
              {/* Tab Navigation Header */}
              <div className="flex items-center gap-2 border-b border-stone-200/80 pb-4 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "overview"
                      ? "bg-[#D6482B] text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Item Description</span>
                </button>

                <button
                  onClick={() => setActiveTab("specs")}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "specs"
                      ? "bg-[#D6482B] text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <InformationCircleIcon className="w-4 h-4" />
                  <span>Lot Specifications</span>
                </button>

                <button
                  onClick={() => setActiveTab("bids")}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "bids"
                      ? "bg-[#D6482B] text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <FireIcon className="w-4 h-4" />
                  <span>Live Bidding Log ({totalBids})</span>
                </button>

                <button
                  onClick={() => setActiveTab("guarantee")}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "guarantee"
                      ? "bg-[#D6482B] text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>Escrow & Protection</span>
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className="pt-6">
                {/* TAB 1: OVERVIEW */}
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-stone-900">
                      About This Lot
                    </h3>

                    {auctionDetail?.description ? (
                      <div className="prose prose-stone max-w-none text-stone-600 text-sm sm:text-base leading-relaxed space-y-3">
                        {auctionDetail.description
                          .split(". ")
                          .filter(Boolean)
                          .map((sentence, index) => (
                            <p key={index} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D6482B] mt-2.5 flex-shrink-0"></span>
                              <span>{sentence.trim()}{sentence.endsWith(".") ? "" : "."}</span>
                            </p>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-stone-400 italic">
                        No additional narrative provided for this item.
                      </p>
                    )}
                  </div>
                )}

                {/* TAB 2: SPECIFICATIONS */}
                {activeTab === "specs" && (
                  <div className="space-y-4 max-w-2xl">
                    <h3 className="text-lg font-bold text-stone-900 mb-2">
                      Lot Specifications
                    </h3>

                    <div className="rounded-2xl border border-stone-200 overflow-hidden divide-y divide-stone-100 text-sm">
                      <div className="grid grid-cols-2 p-3.5 bg-stone-50/50">
                        <span className="text-stone-500 font-medium">Category</span>
                        <span className="font-bold text-stone-900">
                          {auctionDetail?.category || "Uncategorized"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 p-3.5 bg-white">
                        <span className="text-stone-500 font-medium">Condition Grade</span>
                        <span className="font-bold text-stone-900">
                          {auctionDetail?.condition || "Standard"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 p-3.5 bg-stone-50/50">
                        <span className="text-stone-500 font-medium">Starting Price</span>
                        <span className="font-bold text-[#D6482B]">
                          ₹{safeStartingPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 p-3.5 bg-white">
                        <span className="text-stone-500 font-medium">Auction Start Time</span>
                        <span className="font-semibold text-stone-800">
                          {startTime ? startTime.toLocaleString() : "TBD"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 p-3.5 bg-stone-50/50">
                        <span className="text-stone-500 font-medium">Auction End Time</span>
                        <span className="font-semibold text-stone-800">
                          {endTime ? endTime.toLocaleString() : "TBD"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 p-3.5 bg-white">
                        <span className="text-stone-500 font-medium">Verification Status</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckBadgeIcon className="w-4 h-4" /> Authenticated by Platform
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: BIDDING LOG */}
                {activeTab === "bids" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-stone-900">
                        Bid History & Leaderboard
                      </h3>
                      <span className="text-xs text-stone-500">
                        {totalBids} total bids placed
                      </span>
                    </div>

                    {auctionBidders?.length > 0 ? (
                      <div className="space-y-2.5">
                        {auctionBidders.map((bid, index) => (
                          <div
                            key={bid._id || index}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
                              index === 0
                                ? "bg-orange-50/40 border-orange-200/80 shadow-sm"
                                : "bg-white border-stone-100 hover:border-stone-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                                {bid.profileImage ? (
                                  <img
                                    src={bid.profileImage}
                                    alt={bid.userName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <UserCircleIcon className="w-full h-full text-stone-400" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-stone-900 text-sm">
                                    {bid.userName || "Verified Bidder"}
                                  </p>
                                  {index === 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                                      👑 Highest Bidder
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-stone-400">
                                  Verified Bid #{auctionBidders.length - index}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-base font-black text-[#D6482B]">
                                ₹{bid.bidAmount?.toLocaleString()}
                              </p>
                              <span className="text-[11px] font-bold text-stone-400">
                                Rank #{index + 1}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center rounded-2xl bg-stone-50 border border-stone-200/70">
                        <FireIcon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-stone-700">No Bids Placed Yet</p>
                        <p className="text-xs text-stone-400 mt-1">
                          Be the first collector to place a bid on this lot!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: ESCROW & PROTECTION */}
                {activeTab === "guarantee" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <ShieldCheckIcon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">Escrow Protection</h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Funds from winning bids are retained in bank-grade escrow until the buyer inspects and confirms receipt of the authenticated item.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <CheckBadgeIcon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">Authenticity Guarantee</h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Every seller goes through platform identity audit. Lots come with full provenance documentation and return guarantee if misstated.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center">
                        <TruckIcon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">White-Glove Courier</h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        High-value lots are dispatched with fully insured global logistics and real-time tracking from dispatch to doorstep.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* 4. FULLSCREEN IMAGE LIGHTBOX MODAL */}
        {showFullscreen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-7 h-7" />
            </button>

            <div className="max-w-5xl max-h-[85vh] flex items-center justify-center">
              <img
                src={auctionDetail?.itemImage?.url || "/placeholder_image.jpg"}
                alt={auctionDetail?.title}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-white font-bold text-base">
                {auctionDetail?.title}
              </p>
              <p className="text-stone-400 text-xs mt-0.5">
                Press ESC or click anywhere to exit lightbox
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuctionItem;
