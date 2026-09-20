import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout, updateProfile, updatePassword } from "@/store/slices/userSlice";
import Spinner from "@/custom-components/Spinner";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrophyIcon,
  CurrencyRupeeIcon,
  DocumentDuplicateIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  BuildingLibraryIcon,
  CheckBadgeIcon,
  CheckIcon,
  LockClosedIcon,
  CameraIcon,
  PencilSquareIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { FaCrown, FaGem, FaAward, FaPaypal, FaStripe } from "react-icons/fa";
import { toast } from "react-toastify";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);

  const [copiedId, setCopiedId] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'security', 'payout'
  const [imgError, setImgError] = useState(false);

  // Edit Profile / Photo Upload State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editForm, setEditForm] = useState({
    userName: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Change Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigateTo("/login");
    }
  }, [isAuthenticated, loading, navigateTo]);

  const openEditModal = () => {
    setEditForm({
      userName: user?.userName || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setSelectedFile(null);
    setImagePreview(user?.profileImage?.url || null);
    setIsEditModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowed = ["image/png", "image/jpeg", "image/webp", "image/jpg", "image/avif"];
      if (!allowed.includes(file.type)) {
        toast.error("Please upload a valid image (PNG, JPG, WEBP, AVIF)");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setEditForm((prev) => ({
        userName: prev.userName || user?.userName || "",
        phone: prev.phone || user?.phone || "",
        address: prev.address || user?.address || "",
      }));
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }
    if (editForm.userName && editForm.userName !== user?.userName) {
      formData.append("userName", editForm.userName);
    }
    if (editForm.phone && editForm.phone !== user?.phone) {
      formData.append("phone", editForm.phone);
    }
    if (editForm.address && editForm.address !== user?.address) {
      formData.append("address", editForm.address);
    }

    if (!selectedFile && !formData.has("userName") && !formData.has("phone") && !formData.has("address")) {
      setIsEditModalOpen(false);
      return;
    }

    setIsSubmitting(true);
    const success = await dispatch(updateProfile(formData));
    setIsSubmitting(false);

    if (success) {
      setIsEditModalOpen(false);
      setSelectedFile(null);
      setImgError(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill in both new password and confirm password");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    setIsUpdatingPassword(true);
    const success = await dispatch(updatePassword({
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword,
    }));
    setIsUpdatingPassword(false);

    if (success) {
      setIsPasswordModalOpen(false);
      setPasswordForm({
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleCopyId = () => {
    if (user?._id) {
      navigator.clipboard.writeText(user._id);
      setCopiedId(true);
      toast.success("Patron ID copied to clipboard");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigateTo("/");
  };

  // Determine VIP Tier based on moneySpent
  const getPrestigeTier = (spend = 0) => {
    const num = Number(spend) || 0;
    if (num >= 100000) {
      return {
        name: "Diamond Patron",
        description: "Highest VIP collector tier with 0% escrow surcharge.",
        color: "bg-blue-50 text-blue-700 border-blue-200/80",
        badgeColor: "bg-blue-500",
        icon: <FaGem className="w-3.5 h-3.5 text-blue-600" />,
      };
    }
    if (num >= 50000) {
      return {
        name: "Platinum Patron",
        description: "Priority preview privileges and dedicated concierge.",
        color: "bg-purple-50 text-purple-700 border-purple-200/80",
        badgeColor: "bg-purple-500",
        icon: <FaCrown className="w-3.5 h-3.5 text-purple-600" />,
      };
    }
    if (num >= 20000) {
      return {
        name: "Gold Patron",
        description: "Elite collector with priority proxy bid placement.",
        color: "bg-amber-50 text-amber-800 border-amber-200/80",
        badgeColor: "bg-amber-500",
        icon: <FaAward className="w-3.5 h-3.5 text-amber-600" />,
      };
    }
    return {
      name: "Verified Collector",
      description: "Standard verified collector profile with multi-sig escrow.",
      color: "bg-stone-100 text-stone-700 border-stone-200",
      badgeColor: "bg-stone-500",
      icon: <ShieldCheckIcon className="w-3.5 h-3.5 text-stone-500" />,
    };
  };

  const tier = getPrestigeTier(user?.moneySpent);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-stone-50">
        <Spinner />
        <p className="mt-4 text-sm font-semibold text-stone-500">
          Loading collector vault...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50/60 pt-24 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 1. LUXURY COVER & PROFILE HEADER */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
          {/* Subtle Cover Gradient */}
          <div className="relative h-44 sm:h-52 bg-gradient-to-r from-stone-950 via-stone-900 to-[#1c1917] p-6 sm:p-7 flex items-start justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(#D6482B_1px,transparent_1px)] [background-size:18px_18px] opacity-15 pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white backdrop-blur-md border border-white/20 relative z-10">
              <span>AuctionSpace</span>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 text-stone-200 hover:text-white hover:bg-white/20 border border-white/15 transition-all backdrop-blur-md cursor-pointer"
                title="Copy Patron ID"
              >
                {copiedId ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                    <span>ID: {user._id?.slice(-8)}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-white border border-red-500/30 transition-all backdrop-blur-md cursor-pointer"
              >
                <ArrowLeftOnRectangleIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Profile Card Body */}
          <div className="px-6 sm:px-8 pb-8 pt-0 relative">
            {/* Top Row: Only the Avatar overlaps the dark cover banner (-mt-14 sm:-mt-16) */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
              {/* Elevated Avatar with Camera Button & Hover Overlay */}
              <div className="relative group self-center sm:self-auto">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl p-1 bg-white shadow-xl ring-4 ring-white border-2 border-stone-100 overflow-hidden flex-shrink-0 cursor-pointer relative"
                  title="Click to change profile picture"
                >
                  {imagePreview || (user?.profileImage?.url && !imgError) ? (
                    <img
                      src={imagePreview || user.profileImage.url}
                      alt={user.userName}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-stone-100 to-stone-200 flex items-center justify-center font-black text-stone-600 text-3xl shadow-inner">
                      {user?.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-1 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-xs">
                    <CameraIcon className="w-6 h-6 text-white" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
                  </div>
                </div>

                {/* Verified badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-md">
                  <CheckBadgeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Edit Photo Corner Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -top-1 -left-1 w-8 h-8 rounded-full bg-white border border-stone-200 shadow-md flex items-center justify-center text-stone-700 hover:text-[#D6482B] hover:scale-110 transition-all cursor-pointer z-10"
                  title="Upload profile picture"
                >
                  <CameraIcon className="w-4 h-4" />
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg,image/avif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Action Buttons: Cleanly placed on the right side on white background */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 pt-2 sm:pt-0">
                {/* Edit Profile & Photo Button */}
                <button
                  type="button"
                  onClick={openEditModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 hover:border-stone-300 shadow-sm transition-all cursor-pointer"
                >
                  <PencilSquareIcon className="w-3.5 h-3.5 text-[#D6482B]" />
                  <span>Edit Profile</span>
                </button>

                {/* Change Password Button */}
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 hover:border-stone-300 shadow-sm transition-all cursor-pointer"
                >
                  <KeyIcon className="w-3.5 h-3.5 text-[#D6482B]" />
                  <span>Change Password</span>
                </button>

                {user?.role === "Auctioneer" && (
                  <>
                    <Link
                      to="/create-auction"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#D6482B] text-white hover:bg-[#c03e23] transition-all shadow-sm"
                    >
                      <span>Create Auction</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/view-my-auctions"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all"
                    >
                      <span>My Listings</span>
                    </Link>
                  </>
                )}

                {(user?.role === "Super Admin" || user?.role === "Auctioneer") && (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-sm"
                  >
                    <span>Dashboard</span>
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </Link>
                )}

                <Link
                  to="/auctions"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all"
                >
                  <span>Live Catalog</span>
                </Link>
              </div>
            </div>

            {/* User Identity Details: 100% on pure white card, crystal clear contrast */}
            <div className="space-y-1 text-center sm:text-left mb-6 pt-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  {user?.userName}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${tier.color}`}
                >
                  {tier.icon}
                  <span>{tier.name}</span>
                </span>
              </div>

              <p className="text-sm text-stone-500 font-medium">
                {user?.email}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5 text-xs text-stone-400">
                <span className="inline-flex items-center gap-1 font-semibold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-md">
                  Role: {user?.role}
                </span>
                <span>•</span>
                <span>
                  Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently"}
                </span>
                <span>•</span>
                <span className="font-mono text-stone-400">
                  ID: {user?._id?.slice(-8)}
                </span>
              </div>
            </div>

            {/* Segmented Navigation Tabs */}
            <div className="flex items-center gap-2 border-t border-stone-100 pt-4">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "overview"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                  }`}
              >
                Vault Overview
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "security"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                  }`}
              >
                Escrow & Security
              </button>
              {user?.role === "Auctioneer" && (
                <button
                  onClick={() => setActiveTab("payout")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "payout"
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                    }`}
                >
                  Settlement & Payouts
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. ACTIVITY & VOLUME METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {user?.role === "Auctioneer" ? "Unpaid Commission" : "Total Volume Spent"}
              </span>
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#D6482B]">
                <CurrencyRupeeIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-stone-900">
              {user?.role === "Auctioneer"
                ? `₹${Number(user?.unpaidCommission || 0).toLocaleString()}`
                : `₹${Number(user?.moneySpent || 0).toLocaleString()}`}
            </p>
            <p className="mt-1 text-xs text-stone-400">
              {user?.role === "Auctioneer" ? "Pending platform clearance" : "Total auction capital deployed"}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {user?.role === "Auctioneer" ? "Seller Standing" : "Auctions Won"}
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <TrophyIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-amber-600">
              {user?.role === "Auctioneer"
                ? "Active Partner"
                : `${user?.auctionsWon || 0} Lots`}
            </p>
            <p className="mt-1 text-xs text-stone-400">
              {user?.role === "Auctioneer" ? "Verified catalog host" : "Completed hammer acquisitions"}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Collector Rank
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <FaCrown className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-xl sm:text-2xl font-black text-stone-900">
              {tier.name}
            </p>
            <p className="mt-1 text-xs text-stone-400 truncate">
              {tier.description}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Vault Status
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheckIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-xl sm:text-2xl font-black text-emerald-600">
              100% Protected
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Multi-signature escrow active
            </p>
          </div>
        </div>

        {/* 3. TABBED CONTENT */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Personal Details Card */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Personal & Collector Credentials
                  </h3>
                  <p className="text-xs text-stone-500">
                    Verified contact details used for legal auction bills of sale and white-glove courier shipping.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  <CheckBadgeIcon className="w-3.5 h-3.5" />
                  KYC Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <UserIcon className="w-4 h-4 text-[#D6482B]" />
                    <span>Display Username</span>
                  </div>
                  <p className="text-sm font-bold text-stone-900">
                    {user?.userName || "—"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <EnvelopeIcon className="w-4 h-4 text-[#D6482B]" />
                    <span>Registered Email</span>
                  </div>
                  <p className="text-sm font-bold text-stone-900 truncate">
                    {user?.email || "—"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <PhoneIcon className="w-4 h-4 text-[#D6482B]" />
                    <span>Verified Contact</span>
                  </div>
                  <p className="text-sm font-bold text-stone-900">
                    {user?.phone || "—"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70 md:col-span-2">
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <MapPinIcon className="w-4 h-4 text-[#D6482B]" />
                    <span>Vault / Delivery Address</span>
                  </div>
                  <p className="text-sm font-bold text-stone-900">
                    {user?.address || "No primary delivery address specified"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <CalendarDaysIcon className="w-4 h-4 text-[#D6482B]" />
                    <span>Account Inception</span>
                  </div>
                  <p className="text-sm font-bold text-stone-900">
                    {user?.createdAt?.substring(0, 10) || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Auctioneer Payout Methods Summary (if Auctioneer) */}
            {user?.role === "Auctioneer" && (
              <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      Settlement & Payout Configuration
                    </h3>
                    <p className="text-xs text-stone-500">
                      Configured accounts where auction hammer proceeds are automatically wired upon escrow release.
                    </p>
                  </div>
                  {user?.unpaidCommission > 0 && (
                    <Link
                      to="/submit-commission"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#D6482B] text-white hover:bg-[#c03e23] transition-all"
                    >
                      <span>Settle Commission</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Bank Transfer */}
                  <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <BuildingLibraryIcon className="w-4 h-4 text-[#D6482B]" />
                        Direct Bank Wire
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-stone-200/70 text-stone-700 px-2 py-0.5 rounded">
                        NEFT / RTGS
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Bank Name
                      </span>
                      <span className="text-sm font-bold text-stone-900">
                        {user?.paymentMethods?.bankTransfer?.bankName || "Not Configured"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Account Number
                      </span>
                      <span className="text-sm font-mono font-bold text-stone-900">
                        {user?.paymentMethods?.bankTransfer?.bankAccountNumber
                          ? `•••• •••• ${user.paymentMethods.bankTransfer.bankAccountNumber.slice(-4)}`
                          : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Beneficiary
                      </span>
                      <span className="text-xs font-medium text-stone-600">
                        {user?.paymentMethods?.bankTransfer?.bankAccountName || "—"}
                      </span>
                    </div>
                  </div>

                  {/* PayPal */}
                  <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <FaPaypal className="w-4 h-4 text-blue-600" />
                        PayPal Settlement
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-blue-100/70 text-blue-700 px-2 py-0.5 rounded">
                        USD / Global
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        PayPal Email
                      </span>
                      <span className="text-sm font-bold text-stone-900 truncate block">
                        {user?.paymentMethods?.paypal?.paypalEmail || "Not Configured"}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed pt-2 border-t border-stone-200/50">
                      Cross-border lots are cleared within 24 hours of successful buyer receipt confirmation.
                    </p>
                  </div>

                  {/* Stripe */}
                  <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <FaStripe className="w-6 h-4 text-indigo-600" />
                        Stripe Connect
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-indigo-100/70 text-indigo-700 px-2 py-0.5 rounded">
                        Instant
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Stripe Email
                      </span>
                      <span className="text-sm font-bold text-stone-900 truncate block">
                        {user?.paymentMethods?.stripe?.stripeEmail || "Not Configured"}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed pt-2 border-t border-stone-200/50">
                      Direct automated payouts powered by Stripe Multi-Party settlement engine.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECURITY & ESCROW TAB */}
        {activeTab === "security" && (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Escrow & Account Security Safeguards
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Your AuctionSpace account is fortified by banking-grade encryption and automated multi-sig escrow clearing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">
                    Protected Escrow Vault
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Buyer funds are held in isolated fiduciary custody until the buyer receives and verifies the authenticity of the item.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <LockClosedIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">
                    Cryptographic Session Token
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    All bid transactions are authenticated via HTTP-only JWT secure sessions preventing credential interception.
                  </p>
                </div>
              </div>

              {/* Password Management Card */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center flex-shrink-0">
                    <KeyIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">
                      Account Master Password
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                      Regularly updating your security credentials protects your vault, escrow balance, and live bids.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition shadow-sm whitespace-nowrap cursor-pointer"
                >
                  <KeyIcon className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900">
                    Authentication Provenance
                  </h4>
                  <p className="text-xs text-amber-800/80">
                    Need to update your delivery address or contact number? Contact our 24/7 VIP Concierge.
                  </p>
                </div>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-900 text-white hover:bg-amber-800 transition whitespace-nowrap"
              >
                <span>Support Desk</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* PAYOUT TAB (Auctioneer specific) */}
        {activeTab === "payout" && user?.role === "Auctioneer" && (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Auctioneer Settlement Protocol
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Commission clearances and automated disbursements schedule.
                </p>
              </div>
              <Link
                to="/submit-commission"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#D6482B] text-white hover:bg-[#c03e23] transition-all shadow-sm"
              >
                <CurrencyRupeeIcon className="w-4 h-4" />
                <span>Submit Platform Commission</span>
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  Outstanding Platform Commission:
                </span>
                <span className="text-base font-black text-[#D6482B]">
                  ₹{Number(user?.unpaidCommission || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  Disbursement Schedule:
                </span>
                <span className="text-xs font-bold text-stone-800">
                  T+2 Days Post Delivery Confirmation
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  Default Settlement Channel:
                </span>
                <span className="text-xs font-bold text-stone-800">
                  {user?.paymentMethods?.bankTransfer?.bankName
                    ? `${user.paymentMethods.bankTransfer.bankName} (Wire)`
                    : "No Bank Selected"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. QUICK LINKS & EXPLORATION DOCK */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
            Quick Navigation Shortcuts
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/auctions"
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-orange-50/50 border border-stone-200/70 hover:border-orange-200 transition-all text-left group"
            >
              <span className="text-xs font-bold text-stone-800 group-hover:text-[#D6482B] transition-colors block">
                Live Auctions →
              </span>
              <span className="text-[11px] text-stone-400 block mt-0.5">
                Browse catalog drops
              </span>
            </Link>

            <Link
              to="/leaderboard"
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-orange-50/50 border border-stone-200/70 hover:border-orange-200 transition-all text-left group"
            >
              <span className="text-xs font-bold text-stone-800 group-hover:text-[#D6482B] transition-colors block">
                Leaderboard →
              </span>
              <span className="text-[11px] text-stone-400 block mt-0.5">
                View collector ranks
              </span>
            </Link>

            <Link
              to="/how-it-works-info"
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-orange-50/50 border border-stone-200/70 hover:border-orange-200 transition-all text-left group"
            >
              <span className="text-xs font-bold text-stone-800 group-hover:text-[#D6482B] transition-colors block">
                How It Works →
              </span>
              <span className="text-[11px] text-stone-400 block mt-0.5">
                Escrow & rules guide
              </span>
            </Link>

            <Link
              to="/contact"
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-orange-50/50 border border-stone-200/70 hover:border-orange-200 transition-all text-left group"
            >
              <span className="text-xs font-bold text-stone-800 group-hover:text-[#D6482B] transition-colors block">
                24/7 Concierge →
              </span>
              <span className="text-[11px] text-stone-400 block mt-0.5">
                Direct client support
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE & PHOTO MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center">
                  <PencilSquareIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Edit Profile & Photo
                  </h3>
                  <p className="text-xs text-stone-500">
                    Update your vault avatar and verified contact credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
              {/* Photo Uploader Showcase */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-200 border-2 border-white shadow-md flex-shrink-0">
                  {imagePreview || (user?.profileImage?.url && !imgError) ? (
                    <img
                      src={imagePreview || user.profileImage.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-stone-500 text-2xl">
                      {user?.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="text-xs font-bold text-stone-800 truncate max-w-[240px]">
                    {selectedFile ? selectedFile.name : "Profile Picture"}
                  </div>
                  <p className="text-[11px] text-stone-400">
                    PNG, JPEG, WEBP or AVIF up to 5MB.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition shadow-2xs cursor-pointer"
                  >
                    <ArrowUpTrayIcon className="w-3.5 h-3.5 text-[#D6482B]" />
                    <span>{selectedFile ? "Choose Different Image" : "Upload New Photo"}</span>
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Display Username
                  </label>
                  <input
                    type="text"
                    value={editForm.userName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, userName: e.target.value })
                    }
                    placeholder="Your collector name"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Delivery / Vault Address
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                    placeholder="Complete physical delivery address"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#D6482B] text-white hover:bg-[#c03e23] transition shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating Vault...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center">
                  <KeyIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Change Password
                  </h3>
                  <p className="text-xs text-stone-500">
                    Set a new vault security password for your account
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Password must contain at least 8 characters.
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Re-enter new password"
                    minLength={8}
                    required
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={isUpdatingPassword}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#D6482B] text-white hover:bg-[#c03e23] transition shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingPassword ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
