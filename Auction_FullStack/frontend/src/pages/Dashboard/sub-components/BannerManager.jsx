import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBanners,
  createBanner,
  deleteBanner,
  toggleBannerStatus,
} from "@/store/slices/bannerSlice";
import { toast } from "react-toastify";
import {
  SparklesIcon,
  FireIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  PhotoIcon,
  TagIcon,
  ArrowPathIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CurrencyRupeeIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  TrophyIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const BADGE_PRESETS = [
  "SUPER ADMIN EXCLUSIVE",
  "HOT LIVE AUCTION",
  "UPCOMING GALA DROP",
  "AUCTION CONCLUDED • WINNER SPOTLIGHT",
  "RARE COLLECTOR SPOTLIGHT",
  "FEATURED MASTERPIECE",
];

const CATEGORIES = [
  "Watches & Luxury",
  "Fine Art",
  "Automotive & Memorabilia",
  "Jewelry & Diamonds",
  "Collectibles & Antiques",
  "Real Estate & Estates",
  "Electronics & Tech",
  "Fashion & Couture",
];

const BannerManager = () => {
  const dispatch = useDispatch();
  const { allBanners = [], loading } = useSelector((state) => state.banner);
  const { allAuctions = [] } = useSelector((state) => state.auction);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creationMode, setCreationMode] = useState("custom"); // 'custom' | 'catalog'
  const [selectedCatalogId, setSelectedCatalogId] = useState("");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState("All");
  const [catalogStatusFilter, setCatalogStatusFilter] = useState("All"); // 'All' | 'Live' | 'Upcoming' | 'Completed'

  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'active' | 'inactive'
  const [deleteModalId, setDeleteModalId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Watches & Luxury",
    condition: "Mint Condition",
    startingPrice: "",
    currentBid: "",
    totalBids: "",
    winnerName: "",
    winningPrice: "",
    bannerType: "Upcoming",
    badge: "SUPER ADMIN EXCLUSIVE",
    startTime: "",
    endTime: "",
    ctaText: "Explore Upcoming",
    ctaLink: "/auctions",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllBanners());
  }, [dispatch]);

  // Prevent background scroll when any modal is open
  useEffect(() => {
    if (showCreateModal || deleteModalId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCreateModal, deleteModalId]);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Filter available catalog categories
  const availableCategories = [
    "All",
    ...Array.from(new Set(allAuctions.map((a) => a.category).filter(Boolean))),
  ];

  // Filter catalog lots with search, category, and lot status
  const filteredCatalogAuctions = allAuctions.filter((auction) => {
    const matchesSearch =
      !catalogSearch ||
      auction.title?.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      auction.category?.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCategory =
      catalogCategoryFilter === "All" ||
      auction.category === catalogCategoryFilter;

    const isCompleted =
      auction.endTime && new Date(auction.endTime) <= new Date();
    const isLive =
      !isCompleted &&
      auction.startTime &&
      new Date(auction.startTime) <= new Date();
    const isUpcoming = !isCompleted && !isLive;

    let matchesStatus = true;
    if (catalogStatusFilter === "Live") matchesStatus = isLive;
    if (catalogStatusFilter === "Upcoming") matchesStatus = isUpcoming;
    if (catalogStatusFilter === "Completed") matchesStatus = isCompleted;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle image file selection
  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image file size must not exceed 8MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Quick feature from existing catalog auction
  const handleCatalogSelect = (auctionId) => {
    setSelectedCatalogId(auctionId);
    if (!auctionId) return;

    const auction = allAuctions.find((a) => a._id === auctionId);
    if (!auction) return;

    const now = new Date();
    const isCompleted = auction.endTime && new Date(auction.endTime) <= now;
    const isLive =
      !isCompleted &&
      auction.startTime &&
      new Date(auction.startTime) <= now &&
      (!auction.endTime || new Date(auction.endTime) > now);

    const winner =
      auction.highestBidder?.userName ||
      (auction.bids && auction.bids.length > 0
        ? auction.bids[auction.bids.length - 1]?.userName
        : "");

    const startingBid = auction.startingPrice || 0;
    const currentBidVal = auction.currentPrice || startingBid;
    const bidsCount = auction.bids?.length || 0;

    setFormData({
      title: auction.title || "",
      description:
        auction.description ||
        (isCompleted
          ? "Authenticated collector masterpiece successfully auctioned and acquired."
          : "Authenticated rare collector piece ready for global live bidding."),
      category: auction.category || "Watches & Luxury",
      condition: auction.condition || "Mint Condition",
      startingPrice: String(startingBid),
      currentBid: String(currentBidVal),
      totalBids: String(bidsCount),
      winnerName: isCompleted ? winner : "",
      winningPrice: isCompleted ? String(currentBidVal) : "",
      bannerType: isCompleted ? "Completed" : isLive ? "Live Hot" : "Upcoming",
      badge: isCompleted
        ? "AUCTION CONCLUDED • WINNER SPOTLIGHT"
        : isLive
        ? "HOT LIVE AUCTION"
        : "UPCOMING GALA DROP",
      startTime: auction.startTime
        ? new Date(auction.startTime).toISOString().slice(0, 16)
        : "",
      endTime: auction.endTime
        ? new Date(auction.endTime).toISOString().slice(0, 16)
        : "",
      ctaText: isCompleted
        ? "View Concluded Lot"
        : isLive
        ? "Bid Live Now"
        : "Explore Upcoming",
      ctaLink: `/auction/item/${auction._id}`,
    });

    if (auction.itemImage?.url) {
      setImagePreview(auction.itemImage.url);
      setImageFile(null); // Uses existing hosted image URL
    }
  };

  const handleClearCatalogSelection = () => {
    setSelectedCatalogId("");
    setImagePreview("");
    setImageFile(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Watches & Luxury",
      condition: "Mint Condition",
      startingPrice: "",
      currentBid: "",
      totalBids: "",
      winnerName: "",
      winningPrice: "",
      bannerType: "Upcoming",
      badge: "SUPER ADMIN EXCLUSIVE",
      startTime: "",
      endTime: "",
      ctaText: "Explore Upcoming",
      ctaLink: "/auctions",
    });
    setImageFile(null);
    setImagePreview("");
    setSelectedCatalogId("");
    setCatalogSearch("");
    setCatalogCategoryFilter("All");
    setCatalogStatusFilter("All");
  };

  // Preset time helpers
  const setPresetTime = (hoursFromNow) => {
    const d = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
    const formatted = d.toISOString().slice(0, 16);
    setFormData((prev) => ({ ...prev, startTime: formatted }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Banner title is required.");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Banner description is required.");
      return;
    }
    if (!formData.startingPrice) {
      toast.error("Starting price is required.");
      return;
    }
    if (!formData.startTime) {
      toast.error("Start time is required.");
      return;
    }
    if (!imageFile && !imagePreview) {
      toast.error("Please upload or provide a banner image.");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    payload.append("category", formData.category);
    payload.append("condition", formData.condition);
    payload.append("startingPrice", formData.startingPrice);
    payload.append("bannerType", formData.bannerType);
    payload.append("badge", formData.badge.trim());
    payload.append("startTime", new Date(formData.startTime).toISOString());
    if (formData.endTime) {
      payload.append("endTime", new Date(formData.endTime).toISOString());
    }
    payload.append("ctaText", formData.ctaText.trim() || "Explore Upcoming");
    payload.append("ctaLink", formData.ctaLink.trim() || "/auctions");

    if (formData.currentBid) {
      payload.append("currentBid", formData.currentBid);
    }
    if (formData.totalBids !== "") {
      payload.append("totalBids", formData.totalBids);
    }
    if (formData.winnerName) {
      payload.append("winnerName", formData.winnerName.trim());
    }
    if (formData.winningPrice) {
      payload.append("winningPrice", formData.winningPrice);
    }

    if (imageFile) {
      payload.append("itemImage", imageFile);
    } else if (imagePreview) {
      payload.append("imageUrl", imagePreview);
    }

    if (selectedCatalogId) {
      payload.append("auctionItem", selectedCatalogId);
    }

    const res = await dispatch(createBanner(payload));
    if (res?.success) {
      resetForm();
      setShowCreateModal(false);
    }
  };

  // Filtered banners
  const filteredBanners = allBanners.filter((banner) => {
    if (filterStatus === "active") return banner.isActive;
    if (filterStatus === "inactive") return !banner.isActive;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. HEADER SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#D6482B] border border-orange-200/60 mb-3">
            <FireIcon className="w-3.5 h-3.5" />
            <span>Super Admin Dynamic Curation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Spotlight & Hot Auction Banners
          </h2>
          <p className="text-stone-500 text-sm mt-1 max-w-2xl leading-relaxed">
            Curate and schedule high-heat carousel drops displayed prominently on the Home page hero. Control live countdowns, active bids, and concluded winner showcases in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => dispatch(fetchAllBanners())}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
            title="Refresh banner inventory"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Publish New Banner</span>
          </button>
        </div>
      </div>

      {/* 2. CREATE BANNER MODAL (PORTAL TO DOCUMENT.BODY) */}
      {showCreateModal &&
        createPortal(
          <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-start justify-center p-3 sm:p-6 md:p-8 pt-10 sm:pt-14 md:pt-16 pb-12 overflow-y-auto bg-stone-950/85 backdrop-blur-md">
            <div className="relative bg-white rounded-3xl w-full max-w-5xl xl:max-w-6xl max-h-[88vh] overflow-y-auto shadow-2xl border border-stone-200/80 p-5 sm:p-7 md:p-9 my-auto space-y-6">
              
              {/* Modal Header */}
              <div className="sticky -top-5 sm:-top-7 md:-top-9 bg-white/95 backdrop-blur-md z-30 pb-4 pt-1 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D6482B] animate-pulse" />
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                      Publish Hero Carousel Banner
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Spotlight upcoming drops, hot live auctions with real-time bidding, or concluded auctions celebrating the winner.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-950 flex items-center justify-center transition cursor-pointer"
                  title="Close modal"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* 2-COLUMN RESPONSIVE STUDIO LAYOUT */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: Controls & Form Inputs (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* Mode Switcher */}
                  <div className="flex items-center gap-2 p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200/60">
                    <button
                      type="button"
                      onClick={() => setCreationMode("custom")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        creationMode === "custom"
                          ? "bg-white text-stone-900 shadow-sm"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      Custom Spotlight Drop
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreationMode("catalog")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        creationMode === "catalog"
                          ? "bg-white text-stone-900 shadow-sm"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      Feature Existing Auction Lot
                    </button>
                  </div>

                  {/* Visual Catalog Lot Picker (if catalog mode) */}
                  {creationMode === "catalog" && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center font-bold">
                            <SparklesIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-stone-900 uppercase tracking-wide">
                              Choose An Auction Lot to Spotlight
                            </h4>
                            <p className="text-[11px] text-stone-500">
                              Auto-populates photos, timing, active bids, or winner details.
                            </p>
                          </div>
                        </div>

                        {selectedCatalogId && (
                          <button
                            type="button"
                            onClick={handleClearCatalogSelection}
                            className="text-xs font-bold text-[#D6482B] hover:text-[#b33a22] self-start sm:self-auto underline cursor-pointer"
                          >
                            Clear Selection
                          </button>
                        )}
                      </div>

                      {/* If already selected, show prominent Selected Banner */}
                      {selectedCatalogId ? (
                        (() => {
                          const selectedAuction = allAuctions.find((a) => a._id === selectedCatalogId);
                          const isFinished = selectedAuction?.endTime && new Date(selectedAuction.endTime) <= new Date();
                          return (
                            <div className="bg-white rounded-2xl p-3.5 border-2 border-[#D6482B] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0">
                                  <img
                                    src={selectedAuction?.itemImage?.url || imagePreview}
                                    alt={selectedAuction?.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                                      ✓ Selected Lot
                                    </span>
                                    {isFinished ? (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900">
                                        Concluded / Won
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700">
                                        Active
                                      </span>
                                    )}
                                    <span className="text-[10px] text-stone-500 font-semibold">
                                      {selectedAuction?.category}
                                    </span>
                                  </div>
                                  <h5 className="text-xs font-bold text-stone-900 truncate mt-0.5">
                                    {selectedAuction?.title}
                                  </h5>
                                  <p className="text-xs font-black text-[#D6482B]">
                                    {isFinished ? "Winning Hammer Price" : "Current Bid"}: ₹{Number(selectedAuction?.currentPrice || selectedAuction?.startingPrice || 0).toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleClearCatalogSelection}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition whitespace-nowrap self-end sm:self-center cursor-pointer"
                              >
                                Change Lot
                              </button>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="space-y-3 pt-1">
                          {/* Status Filter Tabs */}
                          <div className="flex items-center gap-1.5 border-b border-orange-200/60 pb-2">
                            {[
                              { key: "All", label: "All Lots" },
                              { key: "Live", label: "Live Bidding" },
                              { key: "Upcoming", label: "Upcoming" },
                              { key: "Completed", label: "Completed / Won" },
                            ].map((tab) => (
                              <button
                                type="button"
                                key={tab.key}
                                onClick={() => setCatalogStatusFilter(tab.key)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                  catalogStatusFilter === tab.key
                                    ? "bg-stone-900 text-white shadow-xs"
                                    : "bg-white/80 text-stone-600 hover:bg-white"
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>

                          {/* Search & Category Filter Pills */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                              <MagnifyingGlassIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={catalogSearch}
                                onChange={(e) => setCatalogSearch(e.target.value)}
                                placeholder="Search lots by name or keyword..."
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:border-[#D6482B]"
                              />
                            </div>

                            {/* Category Pills */}
                            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                              {availableCategories.slice(0, 5).map((cat) => (
                                <button
                                  type="button"
                                  key={cat}
                                  onClick={() => setCatalogCategoryFilter(cat)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                                    catalogCategoryFilter === cat
                                      ? "bg-[#D6482B] text-white"
                                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                                  }`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Scrollable Visual Cards List */}
                          <div className="max-h-56 overflow-y-auto pr-1 space-y-2 rounded-xl border border-stone-200/80 bg-white p-2">
                            {filteredCatalogAuctions.length === 0 ? (
                              <p className="text-center py-6 text-xs text-stone-400 font-medium">
                                No matching auctions found in this tab.
                              </p>
                            ) : (
                              filteredCatalogAuctions.map((auction) => {
                                const isFinished =
                                  auction.endTime &&
                                  new Date(auction.endTime) <= new Date();
                                const isLive =
                                  !isFinished &&
                                  auction.startTime &&
                                  new Date(auction.startTime) <= new Date();

                                return (
                                  <div
                                    key={auction._id}
                                    onClick={() => handleCatalogSelect(auction._id)}
                                    className="group flex items-center justify-between gap-3 p-2.5 rounded-xl border border-stone-100 hover:border-orange-300 hover:bg-orange-50/40 transition cursor-pointer"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0">
                                        <img
                                          src={auction.itemImage?.url || "/placeholder_image.jpg"}
                                          alt={auction.title}
                                          className="w-full h-full object-cover group-hover:scale-105 transition"
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span
                                            className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                                              isFinished
                                                ? "bg-amber-100 text-amber-800"
                                                : isLive
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-blue-100 text-blue-800"
                                            }`}
                                          >
                                            {isFinished
                                              ? "Completed"
                                              : isLive
                                              ? "Live Now"
                                              : "Upcoming"}
                                          </span>
                                          <span className="text-[10px] text-stone-500 font-semibold truncate">
                                            {auction.category}
                                          </span>
                                        </div>
                                        <h5 className="text-xs font-bold text-stone-900 truncate mt-0.5 group-hover:text-[#D6482B] transition">
                                          {auction.title}
                                        </h5>
                                        <p className="text-[11px] font-bold text-stone-600">
                                          {isFinished
                                            ? `Won: ₹${Number(auction.currentPrice || auction.startingPrice || 0).toLocaleString("en-IN")}`
                                            : `Price: ₹${Number(auction.currentPrice || auction.startingPrice || 0).toLocaleString("en-IN")}`}
                                        </p>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#D6482B] bg-orange-50 group-hover:bg-[#D6482B] group-hover:text-white transition flex items-center gap-1 flex-shrink-0"
                                    >
                                      <span>Select</span>
                                      <ArrowRightIcon className="w-3 h-3" />
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      Banner Title <span className="text-[#D6482B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Apple 18 Pro (Burgundy) or Vintage Rolex"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      Highlight Description <span className="text-[#D6482B]">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Short description highlighting rarity, condition, and provenance..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#D6482B]"
                      required
                    />
                  </div>

                  {/* Classification Dropdown */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      Banner Classification & Mode
                    </label>
                    <select
                      value={formData.bannerType}
                      onChange={(e) => {
                        const newType = e.target.value;
                        let newBadge = formData.badge;
                        let newCta = formData.ctaText;
                        if (newType === "Live Hot") {
                          newBadge = "HOT LIVE AUCTION";
                          newCta = "Bid Live Now";
                        } else if (newType === "Completed") {
                          newBadge = "AUCTION CONCLUDED • WINNER SPOTLIGHT";
                          newCta = "View Concluded Lot";
                        } else if (newType === "Upcoming") {
                          newBadge = "UPCOMING GALA DROP";
                          newCta = "Explore Upcoming";
                        }
                        setFormData({
                          ...formData,
                          bannerType: newType,
                          badge: newBadge,
                          ctaText: newCta,
                        });
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                    >
                      <option value="Live Hot">🔥 Live Hot (Real-Time Bids & Closing Countdown)</option>
                      <option value="Upcoming">⏳ Upcoming Auction Drop (Opens In Countdown)</option>
                      <option value="Completed">🏆 Completed / Won Auction (Winner Spotlight & Hammer Price)</option>
                      <option value="Exclusive">⭐ Exclusive Super Admin Spotlight</option>
                    </select>
                  </div>

                  {/* CONDITIONAL SECTION A: If Completed Auction */}
                  {formData.bannerType === "Completed" && (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <TrophyIcon className="w-4 h-4 text-amber-600" />
                        <span>Completed Auction Winner Spotlight</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-700">
                            Winning Bidder Username / Name
                          </label>
                          <input
                            type="text"
                            value={formData.winnerName}
                            onChange={(e) =>
                              setFormData({ ...formData, winnerName: e.target.value })
                            }
                            placeholder="e.g. saket07 or John Doe"
                            className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-700">
                            Final Winning Hammer Price (₹)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.winningPrice}
                            onChange={(e) =>
                              setFormData({ ...formData, winningPrice: e.target.value })
                            }
                            placeholder="e.g. 195000"
                            className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CONDITIONAL SECTION B: If Live Auction Heat Metrics */}
                  {formData.bannerType === "Live Hot" && (
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                        <FireIcon className="w-4 h-4 text-[#D6482B]" />
                        <span>Live Bidding Heat & Active Bidder Metrics</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-700">
                            Current Highest Bid (₹)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.currentBid}
                            onChange={(e) =>
                              setFormData({ ...formData, currentBid: e.target.value })
                            }
                            placeholder="e.g. 185000"
                            className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-700">
                            Total Bids Placed
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.totalBids}
                            onChange={(e) =>
                              setFormData({ ...formData, totalBids: e.target.value })
                            }
                            placeholder="e.g. 5"
                            className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Badge Label with 1-Click Presets */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      Badge Tag Label
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, badge: e.target.value })
                      }
                      placeholder="e.g. HOT LIVE AUCTION"
                      className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {BADGE_PRESETS.map((preset) => (
                        <button
                          type="button"
                          key={preset}
                          onClick={() => setFormData({ ...formData, badge: preset })}
                          className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer ${
                            formData.badge === preset
                              ? "bg-[#D6482B] text-white border-[#D6482B]"
                              : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Two-column field cluster */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">
                        Category <span className="text-[#D6482B]">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Condition */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">
                        Condition / Grade
                      </label>
                      <input
                        type="text"
                        value={formData.condition}
                        onChange={(e) =>
                          setFormData({ ...formData, condition: e.target.value })
                        }
                        placeholder="e.g., Mint Condition, Certified"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                      />
                    </div>

                    {/* Starting Price */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">
                        Starting Bid (₹) <span className="text-[#D6482B]">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.startingPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, startingPrice: e.target.value })
                        }
                        placeholder="e.g., 167000"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                        required
                      />
                    </div>

                    {/* CTA Text */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">
                        CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.ctaText}
                        onChange={(e) =>
                          setFormData({ ...formData, ctaText: e.target.value })
                        }
                        placeholder="e.g. Bid Live Now"
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                      />
                    </div>
                  </div>

                  {/* Timing Cluster: Start Time and End Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Start Time */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-stone-700">
                          Live / Drop Start Time <span className="text-[#D6482B]">*</span>
                        </label>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPresetTime(0)}
                            className="text-[10px] text-[#D6482B] hover:underline font-bold cursor-pointer"
                          >
                            Now
                          </button>
                          <span className="text-stone-300">|</span>
                          <button
                            type="button"
                            onClick={() => setPresetTime(24)}
                            className="text-[10px] text-[#D6482B] hover:underline font-bold cursor-pointer"
                          >
                            +24h
                          </button>
                        </div>
                      </div>
                      <input
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({ ...formData, startTime: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                        required
                      />
                    </div>

                    {/* End Time (Essential for Live timer countdown) */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                        <span>Bidding Closes At (End Time)</span>
                        <span className="text-[10px] text-stone-400 font-normal">
                          Drives closing countdown
                        </span>
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                      />
                    </div>
                  </div>

                  {/* Target Link */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      Destination Link
                    </label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={(e) =>
                        setFormData({ ...formData, ctaLink: e.target.value })
                      }
                      placeholder="/auctions or /auction/item/..."
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#D6482B]"
                    />
                  </div>

                  {/* Image Upload Zone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                      <span>
                        Banner Photo Visual <span className="text-[#D6482B]">*</span>
                      </span>
                      {imagePreview && (
                        <span className="text-emerald-600 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircleIcon className="w-3.5 h-3.5" /> Visual Ready
                        </span>
                      )}
                    </label>

                    <div
                      onDragEnter={() => setDragActive(true)}
                      onDragLeave={() => setDragActive(false)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        if (e.dataTransfer.files?.[0]) {
                          handleFile(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition ${
                        dragActive
                          ? "border-[#D6482B] bg-orange-50/50"
                          : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFile(e.target.files[0]);
                          }
                        }}
                      />
                      <PhotoIcon className="w-8 h-8 mx-auto text-stone-400 mb-1" />
                      <p className="text-xs font-bold text-stone-800">
                        Upload custom visual or drag & drop here
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        PNG, JPG, WEBP up to 8MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Live Carousel Preview & Action Console (5 cols) */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-14">
                  
                  {/* Live WYSIWYG Preview Card */}
                  <div className="border border-stone-200/90 rounded-3xl p-4 sm:p-5 bg-stone-50/80 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-stone-800">
                        <EyeIcon className="w-4 h-4 text-[#D6482B]" /> Real-time Carousel Preview
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium lowercase">
                        live mirror
                      </span>
                    </div>

                    {/* Exact Card Mirror */}
                    <div className="relative rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-md flex flex-col justify-between">
                      {/* Image section with gradient */}
                      <div className="relative w-full h-44 bg-stone-100 overflow-hidden flex items-center justify-center">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Banner Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="p-6 text-center text-stone-400 space-y-1">
                            <PhotoIcon className="w-10 h-10 mx-auto text-stone-300" />
                            <p className="text-xs font-semibold">Image preview will appear here</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-xs ${
                              formData.bannerType === "Completed"
                                ? "bg-amber-500 text-white"
                                : formData.bannerType === "Live Hot"
                                ? "bg-emerald-600 text-white"
                                : "bg-white/95 text-[#D6482B]"
                            }`}
                          >
                            {formData.badge || "SUPER ADMIN EXCLUSIVE"}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-[11px] font-semibold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
                            {formData.category || "Watches & Luxury"}
                          </span>
                          <span className="text-[10px] font-medium bg-amber-400/90 text-stone-900 px-2 py-0.5 rounded font-bold">
                            {formData.condition || "Mint"}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="text-base font-black text-stone-900 line-clamp-1 leading-snug">
                            {formData.title || "Apple 18 Pro (Burgundy)"}
                          </h4>
                          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                            {formData.description || "The flagship smartphone featuring high heat live bidding and certified escrow."}
                          </p>
                        </div>

                        {/* CASE A: Completed Auction Preview */}
                        {formData.bannerType === "Completed" ? (
                          <div className="pt-3 border-t border-stone-100 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-wider">
                                  Hammer Price
                                </span>
                                <span className="text-lg font-black text-amber-600">
                                  ₹{Number(formData.winningPrice || formData.startingPrice || 195000).toLocaleString("en-IN")}
                                </span>
                              </div>
                              <span className="px-3 py-1.5 rounded-xl font-bold text-xs bg-stone-900 text-white shadow-xs inline-flex items-center gap-1">
                                <span>{formData.ctaText || "View Concluded"}</span>
                                <ArrowRightIcon className="w-3 h-3" />
                              </span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 border border-amber-200/80">
                              <TrophyIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                              <span className="text-[11px] font-bold text-amber-900 truncate">
                                Won by @{formData.winnerName || "Winning Bidder"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          /* CASE B: Live or Upcoming Auction Preview */
                          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-wider">
                                {formData.bannerType === "Live Hot" && formData.currentBid
                                  ? "Current Highest Bid"
                                  : "Starting Bid"}
                              </span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-black text-[#D6482B]">
                                  ₹{Number(formData.currentBid || formData.startingPrice || 167000).toLocaleString("en-IN")}
                                </span>
                                {formData.bannerType === "Live Hot" && (Number(formData.totalBids) > 0 || (formData.currentBid && Number(formData.currentBid) > Number(formData.startingPrice))) && (
                                  <span className="text-[10px] font-black text-[#D6482B] bg-orange-50 px-1.5 py-0.5 rounded-md">
                                    🔥 {Number(formData.totalBids) > 0 ? formData.totalBids : 1} {Number(formData.totalBids) === 1 ? "bid" : "bids"}
                                  </span>
                                )}
                              </div>
                            </div>

                            <span
                              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs text-white shadow-xs inline-flex items-center gap-1 ${
                                formData.bannerType === "Live Hot"
                                  ? "bg-emerald-600"
                                  : "bg-[#D6482B]"
                              }`}
                            >
                              <span>{formData.ctaText || (formData.bannerType === "Live Hot" ? "Bid Live Now" : "Explore Upcoming")}</span>
                              <ArrowRightIcon className="w-3 h-3" />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Publishing Console Box */}
                  <div className="bg-stone-900 text-white rounded-3xl p-5 border border-stone-800 space-y-4 shadow-lg">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                        Publishing Checklist
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">
                        Home Page Hero Deployment
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        This drop will automatically rotate every 3.5 seconds alongside other active banners.
                      </p>
                    </div>

                    <div className="space-y-2 pt-1 border-t border-stone-800 text-xs">
                      <div className="flex items-center justify-between text-stone-300">
                        <span>Classification:</span>
                        <span className="font-bold text-white">{formData.bannerType}</span>
                      </div>
                      <div className="flex items-center justify-between text-stone-300">
                        <span>Status:</span>
                        <span className="font-bold text-emerald-400">Active Immediately</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-lg shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            <span>Uploading to Cloudinary...</span>
                          </>
                        ) : (
                          <>
                            <SparklesIcon className="w-4 h-4" />
                            <span>Publish Banner Live</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="w-full py-2.5 rounded-2xl text-xs font-bold text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      >
                        Cancel & Discard
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* 3. ACTIVE BANNERS INVENTORY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              Live Banner Inventory ({allBanners.length})
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Currently curated carousel drops rotating on the Home page.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === "all"
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              All ({allBanners.length})
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === "active"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Active ({allBanners.filter((b) => b.isActive).length})
            </button>
            <button
              onClick={() => setFilterStatus("inactive")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === "inactive"
                  ? "bg-stone-700 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              Inactive ({allBanners.filter((b) => !b.isActive).length})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredBanners.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
            <PhotoIcon className="w-12 h-12 text-stone-300 mx-auto" />
            <h4 className="text-sm font-bold text-stone-800">
              No Banners Found in this View
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              You haven't posted any dynamic banners yet. Click "Publish New Banner" above to feature an upcoming drop, live auction, or concluded lot.
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#D6482B] hover:bg-[#b33a22] transition shadow-sm cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create First Banner</span>
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredBanners.map((banner) => {
              const startDate = new Date(banner.startTime);
              const endDate = banner.endTime ? new Date(banner.endTime) : null;
              const isFinished =
                banner.bannerType === "Completed" ||
                (endDate && endDate <= new Date() && banner.bannerType !== "Upcoming") ||
                Boolean(banner.winnerName);
              const isLive =
                !isFinished &&
                ((startDate <= new Date() && (!endDate || endDate > new Date())) ||
                  banner.bannerType === "Live Hot");

              return (
                <div
                  key={banner._id}
                  className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                    banner.isActive
                      ? "bg-white border-stone-200 hover:border-orange-300 shadow-sm hover:shadow-md"
                      : "bg-stone-50/70 border-stone-200 opacity-60"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                      <img
                        src={banner.itemImage?.url}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                            isFinished
                              ? "bg-amber-50 text-amber-900 border-amber-200"
                              : isLive
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-orange-50 text-[#D6482B] border-orange-200/60"
                          }`}
                        >
                          {banner.badge || (isFinished ? "CONCLUDED LOT" : isLive ? "LIVE NOW" : "UPCOMING")}
                        </span>
                        <span className="text-[10px] text-stone-500 font-semibold">
                          {banner.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-stone-900 truncate">
                        {banner.title}
                      </h4>

                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {banner.description}
                      </p>

                      {/* Pricing & Bidders */}
                      <div className="flex items-center gap-3 pt-1 text-xs flex-wrap">
                        {isFinished ? (
                          <>
                            <span className="font-bold text-amber-700">
                              Won: ₹{Number(banner.winningPrice || banner.currentBid || banner.startingPrice).toLocaleString("en-IN")}
                            </span>
                            {banner.winnerName && (
                              <>
                                <span className="text-stone-300">•</span>
                                <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                                  <TrophyIcon className="w-3.5 h-3.5 text-amber-600" />
                                  @{banner.winnerName}
                                </span>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="font-bold text-[#D6482B]">
                              {banner.currentBid && banner.currentBid > banner.startingPrice
                                ? `Current: ₹${Number(banner.currentBid).toLocaleString("en-IN")}`
                                : `Starting: ₹${Number(banner.startingPrice).toLocaleString("en-IN")}`}
                            </span>
                            {banner.totalBids > 0 && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {banner.totalBids} bids
                              </span>
                            )}
                            <span className="text-stone-300">•</span>
                            <span className="text-stone-500 text-[11px] flex items-center gap-1">
                              <ClockIcon className="w-3.5 h-3.5 text-stone-400" />
                              {isLive
                                ? "Live Bidding"
                                : `Goes live ${startDate.toLocaleDateString([], {
                                    month: "short",
                                    day: "numeric",
                                  })}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(toggleBannerStatus(banner._id))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          banner.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                        }`}
                      >
                        {banner.isActive ? (
                          <>
                            <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active on Home</span>
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="w-3.5 h-3.5 text-stone-400" />
                            <span>Inactive (Hidden)</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => setDeleteModalId(banner._id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Delete banner"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. DELETE CONFIRMATION MODAL (PORTAL TO DOCUMENT.BODY) */}
      {deleteModalId &&
        createPortal(
          <div className="fixed inset-0 w-screen h-screen z-[999999] flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <ExclamationTriangleIcon className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-stone-900">
                  Confirm Banner Removal
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Are you sure you want to delete this spotlight banner? The image asset will be removed from Cloudinary and it will no longer display on the Home page carousel.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalId(null)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-stone-100 text-stone-700 hover:bg-stone-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await dispatch(deleteBanner(deleteModalId));
                    setDeleteModalId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-red-600 text-white hover:bg-red-700 transition shadow-sm cursor-pointer"
                >
                  Delete Banner
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default BannerManager;
