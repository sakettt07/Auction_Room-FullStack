import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createAuction } from "@/store/slices/auctionSlice";
import { toast } from "react-toastify";
import {
  CameraIcon,
  XMarkIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  TagIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  FireIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

const CreateAuction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { loading } = useSelector((state) => state.auction);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "Like New",
    startingBid: "",
  });

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [errors, setErrors] = useState({});

  const auctionCategories = [
    "Jewelry & Watches",
    "Art & Antiques",
    "Automobiles",
    "Electronics",
    "Real Estate",
    "Collectibles",
    "Fashion & Accessories",
    "Sports Memorabilia",
    "Musical Instruments",
    "Furniture",
    "Books & Manuscripts",
    "Toys & Hobbies",
  ];

  const conditions = [
    "New",
    "Like New",
    "Refurbished",
    "Good",
    "Fair",
    "Vintage",
  ];

  // Protect route for Auctioneer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user && user.role !== "Auctioneer") {
      toast.error("Auction curation is reserved for verified Auctioneer accounts.");
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handlePricePreset = (increment) => {
    const current = parseInt(form.startingBid || "0", 10) || 0;
    setForm({ ...form, startingBid: String(current + increment) });
    if (errors.startingBid) {
      setErrors({ ...errors, startingBid: null });
    }
  };

  const handleDurationPreset = (days) => {
    const start = startTime || new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now if not set
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    setStartTime(start);
    setEndTime(end);
    setErrors({ ...errors, startTime: null, endTime: null, timeRange: null });
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP, AVIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size should be less than 10MB");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors({ ...errors, image: null });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Lot title is required";
    if (form.title.trim().length < 4)
      newErrors.title = "Title must be at least 4 characters";
    if (!form.description.trim())
      newErrors.description = "Detailed provenance description is required";
    if (!form.category) newErrors.category = "Please select a catalog category";
    if (!form.condition) newErrors.condition = "Please select lot condition";

    if (!form.startingBid) {
      newErrors.startingBid = "Starting reserve bid is required";
    } else if (parseInt(form.startingBid, 10) <= 0) {
      newErrors.startingBid = "Starting bid must be greater than ₹0";
    }

    if (!image) newErrors.image = "Please upload an auction thumbnail image";
    if (!startTime) newErrors.startTime = "Please set auction start time";
    if (!endTime) newErrors.endTime = "Please set auction ending time";

    if (startTime && startTime < new Date(Date.now() - 60000)) {
      newErrors.startTime = "Start time must be in the future";
    }
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      newErrors.timeRange = "Concluding time must be set after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "",
      condition: "Like New",
      startingBid: "",
    });
    removeImage();
    setStartTime(null);
    setEndTime(null);
    setErrors({});
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required auction details");
      return;
    }

    const formData = new FormData();
    formData.append("itemImage", image);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("condition", form.condition);
    formData.append("startingPrice", parseInt(form.startingBid, 10));
    formData.append("startTime", startTime.toISOString());
    formData.append("endTime", endTime.toISOString());

    try {
      const res = await dispatch(createAuction(formData));
      if (res?.payload?.success !== false) {
        resetForm();
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 5000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to curate auction. Please check inputs and retry.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 pt-6 sm:pt-8 pb-20 selection:bg-[#D6482B]/10 selection:text-[#D6482B]">
      {/* AMBIENT BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#D6482B]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            1. STUDIO HEADER
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#D6482B] border border-orange-200/60 mb-2.5">
              <SparklesIcon className="w-3.5 h-3.5" />
              Certified Auctioneer Curation Studio
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              Create New{" "}
              <span className="bg-gradient-to-r from-[#D6482B] via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Auction
              </span>
            </h1>
            <p className="text-stone-500 text-sm sm:text-base mt-1.5 max-w-2xl">
              Curate authenticated lots, establish starting reserves, and schedule bidding sessions with guaranteed escrow settlement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/view-my-auctions"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 hover:border-stone-300 transition shadow-sm cursor-pointer"
            >
              <EyeIcon className="w-4 h-4 text-stone-500" />
              <span>My Listings</span>
            </Link>
          </div>
        </div>

        {/* SUCCESS BANNER */}
        {formSubmitted && (
          <div className="my-6 bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Auction Successfully Curated!
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Your lot has been listed in the catalog and will automatically activate on the scheduled date.
                </p>
              </div>
            </div>
            <Link
              to="/view-my-auctions"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm whitespace-nowrap"
            >
              View in Console →
            </Link>
          </div>
        )}

        {/* =========================================================================
            2. TWO-COLUMN STUDIO WORKSPACE
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-start">
          {/* LEFT COLUMN: PRIMARY CURATION FORM (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleCreateAuction} className="space-y-6">
              {/* SECTION 1: LOT IDENTITY & PROVENANCE */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      Lot Identity & Provenance
                    </h3>
                    <p className="text-xs text-stone-500">
                      Define the headline, catalog categorization, and verifiable lot details.
                    </p>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Lot Title <span className="text-[#D6482B]">*</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. 1972 Rolex Daytona Reference 6263"
                    className={`w-full px-4 py-3 rounded-2xl bg-stone-50 border ${
                      errors.title
                        ? "border-red-400 focus:ring-red-200"
                        : "border-stone-200 focus:border-[#D6482B] focus:ring-[#D6482B]/20"
                    } text-sm text-stone-900 focus:outline-none focus:ring-2 transition placeholder:text-stone-400`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Category & Condition */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Category <span className="text-[#D6482B]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-2xl bg-stone-50 border ${
                          errors.category
                            ? "border-red-400"
                            : "border-stone-200 focus:border-[#D6482B] focus:ring-[#D6482B]/20"
                        } text-sm text-stone-900 focus:outline-none focus:ring-2 transition appearance-none cursor-pointer`}
                      >
                        <option value="">Select Category</option>
                        {auctionCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.category && (
                      <p className="text-xs text-red-600 font-medium mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Condition */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Condition <span className="text-[#D6482B]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition appearance-none cursor-pointer"
                      >
                        {conditions.map((cond) => (
                          <option key={cond} value={cond}>
                            {cond}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Catalog Description & Provenance{" "}
                      <span className="text-[#D6482B]">*</span>
                    </label>
                    <span className="text-[11px] text-stone-400">
                      {form.description.length} characters
                    </span>
                  </div>
                  <textarea
                    rows="4"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Elaborate on provenance history, maker hallmarks, dimensions, accompanying certificates, and archival condition notes..."
                    className={`w-full px-4 py-3 rounded-2xl bg-stone-50 border ${
                      errors.description
                        ? "border-red-400"
                        : "border-stone-200 focus:border-[#D6482B] focus:ring-[#D6482B]/20"
                    } text-sm text-stone-900 focus:outline-none focus:ring-2 transition placeholder:text-stone-400 resize-none`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* SECTION 2: VALUATION & STARTING RESERVE */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      Valuation & Reserve Minimum
                    </h3>
                    <p className="text-xs text-stone-500">
                      Establish the initial threshold required for collector participation.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Starting Bid Amount (INR ₹){" "}
                    <span className="text-[#D6482B]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-base">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="startingBid"
                      value={form.startingBid}
                      onChange={handleChange}
                      placeholder="50,000"
                      min="1"
                      className={`w-full pl-9 pr-4 py-3 rounded-2xl bg-stone-50 border ${
                        errors.startingBid
                          ? "border-red-400"
                          : "border-stone-200 focus:border-[#D6482B] focus:ring-[#D6482B]/20"
                      } text-base font-bold text-stone-900 focus:outline-none focus:ring-2 transition placeholder:text-stone-400`}
                    />
                  </div>
                  {errors.startingBid && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.startingBid}
                    </p>
                  )}

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-[11px] text-stone-400 font-medium">
                      Quick increments:
                    </span>
                    {[
                      { label: "+₹10K", val: 10000 },
                      { label: "+₹50K", val: 50000 },
                      { label: "+₹1,00,000", val: 100000 },
                      { label: "+₹5,00,000", val: 500000 },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => handlePricePreset(btn.val)}
                        className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-orange-50 hover:text-[#D6482B] border border-stone-200 text-xs font-semibold text-stone-700 transition cursor-pointer"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: AUCTION TIMELINE & SCHEDULE */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      Bidding Window Timeline
                    </h3>
                    <p className="text-xs text-stone-500">
                      Define the exact start and ending timestamps for this auction lot.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date Picker */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Starts On <span className="text-[#D6482B]">*</span>
                    </label>
                    <div className="relative">
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
                        placeholderText="Select Start Timestamp"
                        className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition"
                      />
                      <ClockIcon className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.startTime && (
                      <p className="text-xs text-red-600 font-medium">
                        {errors.startTime}
                      </p>
                    )}
                  </div>

                  {/* End Date Picker */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Ends On (Hammer Time) <span className="text-[#D6482B]">*</span>
                    </label>
                    <div className="relative">
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
                        placeholderText="Select Ending Timestamp"
                        className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition"
                      />
                      <ClockIcon className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.endTime && (
                      <p className="text-xs text-red-600 font-medium">
                        {errors.endTime}
                      </p>
                    )}
                  </div>
                </div>

                {errors.timeRange && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.timeRange}
                  </p>
                )}

                {/* Duration Presets */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[11px] text-stone-400 font-medium">
                    Duration Presets:
                  </span>
                  {[
                    { label: "24 Hours Drop", days: 1 },
                    { label: "3 Days Event", days: 3 },
                    { label: "5 Days Showcase", days: 5 },
                    { label: "7 Days Grand Auction", days: 7 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleDurationPreset(preset.days)}
                      className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-orange-50 hover:text-[#D6482B] border border-stone-200 text-xs font-semibold text-stone-700 transition cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 4: MEDIA & IMAGE CURATION */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      Media & Visual Asset Curation
                    </h3>
                    <p className="text-xs text-stone-500">
                      Upload high-resolution photography capturing authenticity and details.
                    </p>
                  </div>
                </div>

                <div
                  className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? "border-[#D6482B] bg-orange-50/50"
                      : errors.image
                      ? "border-red-300 bg-red-50/50"
                      : "border-stone-300 hover:border-[#D6482B] bg-stone-50/60"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp, image/jpg, image/avif"
                    onChange={handleImageChange}
                  />

                  {imagePreview ? (
                    <div className="relative inline-block group">
                      <img
                        src={imagePreview}
                        alt="Lot Preview"
                        className="max-h-60 rounded-2xl shadow-md object-contain mx-auto border border-stone-200"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute -top-2.5 -right-2.5 bg-stone-900 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-all cursor-pointer"
                        title="Remove photo"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="w-14 h-14 rounded-2xl bg-orange-100/80 text-[#D6482B] flex items-center justify-center mx-auto mb-3">
                        <ArrowUpTrayIcon className="w-6 h-6" />
                      </div>
                      <p className="text-stone-900 text-sm font-bold">
                        Click to upload or drag & drop lot imagery
                      </p>
                      <p className="text-stone-400 text-xs mt-1">
                        High-resolution PNG, JPG, WEBP, or AVIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.image}
                  </p>
                )}
              </div>

              {/* FORM ACTION DOCK */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="px-5 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D6482B] hover:bg-[#b83b22] text-white text-sm font-bold shadow-xl shadow-[#D6482B]/20 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Minting & Publishing Lot...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4 stroke-[2.5]" />
                      <span>Publish Auction to Marketplace</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: STICKY REAL-TIME PREVIEW & PROTOCOL (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* LIVE PREVIEW BADGE */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Live Catalog Card Preview
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Real-Time Synchronized
              </span>
            </div>

            {/* LIVE CARD PREVIEW CONTAINER */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-md overflow-hidden flex flex-col group">
              {/* Card Image */}
              <div className="relative h-60 bg-stone-100 overflow-hidden">
                <img
                  src={imagePreview || "/placeholder_image.jpg"}
                  alt={form.title || "Lot preview"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Status Pill */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md border bg-amber-100 text-amber-800 border-amber-200">
                    <span>
                      {startTime && startTime <= new Date() ? "Live Now" : "Upcoming"}
                    </span>
                  </span>
                </div>

                {/* Category */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-stone-800 shadow-sm">
                    {form.category || "Select Category"}
                  </span>
                </div>

                {/* Condition */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                    {form.condition || "Like New"} Condition
                  </span>
                </div>

                {/* Bids Counter */}
                <div className="absolute bottom-3 right-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D6482B] text-white shadow-sm flex items-center gap-1">
                    <FireIcon className="w-3 h-3" />
                    <span>0 bids</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-stone-900 text-lg line-clamp-1">
                    {form.title || "Your Item Headline Here"}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {form.description ||
                      "Your provenance notes and catalog lot specifications will appear here."}
                  </p>
                </div>

                {/* Price Container */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                      Starting Reserve Bid
                    </span>
                    <span className="text-lg font-black text-stone-900">
                      ₹{Number(form.startingBid || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                      Estimated Duration
                    </span>
                    <span className="text-xs font-bold text-stone-700">
                      {startTime && endTime
                        ? `${Math.max(
                            1,
                            Math.round(
                              (new Date(endTime) - new Date(startTime)) /
                                (1000 * 60 * 60 * 24)
                            )
                          )} Days Drop`
                        : "7 Days"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span>Auctioneer: {user?.userName || "You"}</span>
                  <span className="flex items-center gap-1 text-[#D6482B] font-bold">
                    <span>Inspect Lot</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* AUCTIONEER PROTOCOL & ESCROW NOTICE */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <ShieldCheckIcon className="w-5 h-5 text-[#D6482B]" />
                <h4>Auctioneer Escrow Protocols</h4>
              </div>

              <div className="space-y-2.5 text-xs text-stone-500 leading-relaxed">
                <div className="flex items-start gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>5% Platform Settlement:</strong> A transparent 5% platform service fee applies only upon successful hammer closure.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Protected Custody:</strong> Winning collector funds are locked in fiduciary escrow until trackable delivery confirmation.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Instant Auto-Scheduling:</strong> Live countdown timers and collector push notifications initiate automatically on launch.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;
