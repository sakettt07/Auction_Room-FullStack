import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { postCommissionProof } from "@/store/slices/commissionSlice";
import { toast } from "react-toastify";
import {
  CurrencyRupeeIcon,
  PhotoIcon,
  DocumentTextIcon,
  XMarkIcon,
  InformationCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  ClockIcon,
  EyeIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

const SubmitCommission = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { loading } = useSelector((state) => state.commission);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [proof, setProof] = useState(null);
  const [preview, setPreview] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [amountError, setAmountError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Copy helpers state
  const [copiedField, setCopiedField] = useState(null);

  const unpaidCommission = user?.unpaidCommission || 0;

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user && user.role !== "Auctioneer") {
      toast.error("Commission settlement is reserved for registered Auctioneers.");
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Clean preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileProcess = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image receipt (PNG, JPG, WEBP, AVIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should not exceed 10MB");
      return;
    }

    setProof(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileProcess(file);
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
    handleFileProcess(file);
  };

  const removeImage = () => {
    setProof(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateAmount = (value) => {
    if (!value) {
      setAmountError("Settlement amount is required");
      return false;
    }

    const numValue = Number(value);

    if (isNaN(numValue) || numValue <= 0) {
      setAmountError("Please enter a valid amount greater than ₹0");
      return false;
    }

    if (unpaidCommission > 0 && numValue > unpaidCommission) {
      setAmountError(
        `Amount cannot exceed total unpaid commission of ₹${unpaidCommission.toLocaleString("en-IN")}`
      );
      return false;
    }

    setAmountError("");
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    validateAmount(value);
  };

  const setPresetAmount = (val) => {
    setAmount(String(val));
    validateAmount(String(val));
  };

  const handlePaymentProof = async (e) => {
    e.preventDefault();

    if (!validateAmount(amount)) return;

    if (!proof) {
      toast.error("Please attach a screenshot or bank transaction receipt");
      return;
    }

    const formData = new FormData();
    formData.append("proofImage", proof);
    formData.append("amount", parseInt(amount, 10));
    formData.append("comment", comment);

    const res = await dispatch(postCommissionProof(formData));

    if (!res?.error) {
      setAmount("");
      setComment("");
      setProof(null);
      setPreview("");
      setSubmitted(true);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => setSubmitted(false), 6000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 pt-6 sm:pt-8 pb-20 selection:bg-[#D6482B]/10 selection:text-[#D6482B]">
      {/* AMBIENT BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
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
              Platform Commission Settlement Console
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              Commission{" "}
              <span className="bg-gradient-to-r from-[#D6482B] via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Settlement
              </span>
            </h1>
            <p className="text-stone-500 text-sm sm:text-base mt-1.5 max-w-2xl">
              Remit platform dues from concluded auctions, upload wire transfer vouchers, and maintain your certified auctioneer standing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/view-my-auctions"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 hover:border-stone-300 transition shadow-sm cursor-pointer"
            >
              <EyeIcon className="w-4 h-4 text-stone-500" />
              <span>Auction Console</span>
            </Link>
          </div>
        </div>

        {/* SUBMISSION CONFIRMATION NOTIFICATION */}
        {submitted && (
          <div className="my-6 bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Payment Proof Dispatched for Verification!
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Our treasury desk reconciles bank transactions within T+24 hours. Your ledger balance will automatically update.
                </p>
              </div>
            </div>
            <Link
              to="/me"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm whitespace-nowrap"
            >
              View Vault →
            </Link>
          </div>
        )}

        {/* =========================================================================
            2. OUTSTANDING BALANCE KPI BAR
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          {/* Outstanding Balance */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-6 border border-stone-800 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Outstanding Platform Dues
              </span>
              <CurrencyRupeeIcon className="w-5 h-5 text-[#D6482B]" />
            </div>
            <div className="my-3">
              <p className="text-3xl sm:text-4xl font-black text-white">
                ₹{Number(unpaidCommission).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
              <span>Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${unpaidCommission > 0
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
              >
                {unpaidCommission > 0 ? "Pending Remittance" : "Account Clear"}
              </span>
            </div>
          </div>

          {/* Standard Platform Rate Protocol */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Platform Service Tariff
              </span>
              <BanknotesIcon className="w-5 h-5 text-stone-500" />
            </div>
            <div className="my-3">
              <p className="text-2xl sm:text-3xl font-black text-stone-900">
                5.00%
              </p>
            </div>
            <p className="text-xs text-stone-500 pt-2 border-t border-stone-100">
              Levied exclusively on completed hammer sales upon settlement.
            </p>
          </div>

          {/* Treasury SLA Window */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Treasury Audit SLA
              </span>
              <ClockIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="my-3">
              <p className="text-2xl sm:text-3xl font-black text-emerald-700">
                &lt; 24 Hours
              </p>
            </div>
            <p className="text-xs text-stone-500 pt-2 border-t border-stone-100">
              Automated ledger reconciliation post receipt upload.
            </p>
          </div>
        </div>

        {/* =========================================================================
            3. TWO-COLUMN WORKSPACE: FORM & BENEFICIARY WIRE DETAILS
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: PAYMENT PROOF FORM (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {unpaidCommission === 0 ? (
              /* Zero Balance Celebratory Card */
              <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-8 sm:p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckBadgeIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">
                  Your Account is in Exemplary Standing!
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                  You have ₹0 in outstanding platform commissions. All previous auction lot settlements have been reconciled.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <Link
                    to="/create-auction"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D6482B] hover:bg-[#b83b22] text-white text-xs font-bold transition shadow-md"
                  >
                    <span>Curate New Auction</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/view-my-auctions"
                    className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition"
                  >
                    Manage Listings
                  </Link>
                </div>
              </div>
            ) : (
              /* Remittance Submission Form */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
                <div className="pb-4 border-b border-stone-100">
                  <h3 className="text-base font-bold text-stone-900">
                    Dispatch Transfer Verification
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Specify the transfer amount, attach your transaction screenshot, and submit for clearance.
                  </p>
                </div>

                <form onSubmit={handlePaymentProof} className="space-y-6">
                  {/* Amount Paid Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Amount Remitted (INR ₹){" "}
                      <span className="text-[#D6482B]">*</span>
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-base">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        onBlur={() => validateAmount(amount)}
                        placeholder="Enter paid amount"
                        required
                        min="1"
                        max={unpaidCommission}
                        className={`w-full pl-9 pr-4 py-3 rounded-2xl bg-stone-50 border ${amountError
                            ? "border-red-400 focus:ring-red-200"
                            : "border-stone-200 focus:border-[#D6482B] focus:ring-[#D6482B]/20"
                          } text-base font-bold text-stone-900 focus:outline-none focus:ring-2 transition placeholder:text-stone-400`}
                      />
                    </div>

                    {amountError && (
                      <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                        <InformationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{amountError}</span>
                      </p>
                    )}

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <span className="text-[11px] text-stone-400 font-medium">
                        Quick presets:
                      </span>
                      <button
                        type="button"
                        onClick={() => setPresetAmount(unpaidCommission)}
                        className="px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#D6482B] border border-orange-200/60 text-xs font-bold transition cursor-pointer"
                      >
                        Full Due (₹{unpaidCommission.toLocaleString("en-IN")})
                      </button>
                      {unpaidCommission > 2000 && (
                        <button
                          type="button"
                          onClick={() =>
                            setPresetAmount(Math.round(unpaidCommission / 2))
                          }
                          className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 text-xs font-semibold transition cursor-pointer"
                        >
                          50% (₹{Math.round(unpaidCommission / 2).toLocaleString("en-IN")})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Payment Screenshot Dropzone */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Bank Transaction Screenshot or Receipt{" "}
                      <span className="text-[#D6482B]">*</span>
                    </label>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${dragActive
                          ? "border-[#D6482B] bg-orange-50/50"
                          : "border-stone-300 hover:border-[#D6482B] bg-stone-50/60"
                        }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/jpg, image/avif"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      {preview ? (
                        <div className="relative inline-block group">
                          <img
                            src={preview}
                            alt="Receipt Preview"
                            className="max-h-60 rounded-2xl shadow-md object-contain mx-auto border border-stone-200"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage();
                            }}
                            className="absolute -top-2.5 -right-2.5 bg-stone-900 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition cursor-pointer"
                            title="Remove screenshot"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="py-3">
                          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#D6482B] flex items-center justify-center mx-auto mb-3">
                            <ArrowUpTrayIcon className="w-5 h-5" />
                          </div>
                          <p className="text-stone-900 text-sm font-bold">
                            Click to upload or drag & drop payment voucher
                          </p>
                          <p className="text-stone-400 text-xs mt-1">
                            PNG, JPG, WEBP, or AVIF receipt up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comment / UTR Remarks Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Settlement Remarks & UTR Number (Optional)
                    </label>
                    <textarea
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Include bank transfer UTR number, originating account name, or specific auction lot references..."
                      className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition placeholder:text-stone-400 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !proof ||
                      !amount ||
                      amountError ||
                      unpaidCommission === 0
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D6482B] hover:bg-[#b83b22] text-white text-sm font-bold shadow-xl shadow-[#D6482B]/20 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting to Treasury...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheckIcon className="w-5 h-5" />
                        <span>Submit Remittance Proof</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: OFFICIAL BENEFICIARY WIRE CHANNELS (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* OFFICIAL BENEFICIARY BANK ACCOUNT CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                <div className="w-9 h-9 rounded-2xl bg-orange-100 text-[#D6482B] flex items-center justify-center flex-shrink-0">
                  <BuildingLibraryIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Official Treasury Wire Channels
                  </h3>
                  <p className="text-xs text-stone-500">
                    Remit platform commission via NEFT, RTGS, IMPS, or UPI
                  </p>
                </div>
              </div>

              {/* Wire details list */}
              <div className="space-y-3.5 text-xs">
                {/* Beneficiary Name */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                      Beneficiary Legal Entity
                    </span>
                    <span className="font-bold text-stone-900 text-sm">
                      AuctionSpace Treasury Private Ltd
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        "AuctionSpace Treasury Private Ltd",
                        "Entity Name"
                      )
                    }
                    className="p-1.5 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-900 transition"
                    title="Copy Name"
                  >
                    {copiedField === "Entity Name" ? (
                      <CheckIcon className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Account Number */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                      Current Account Number
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      50200084920194
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard("50200084920194", "Account Number")
                    }
                    className="p-1.5 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-900 transition"
                    title="Copy Account Number"
                  >
                    {copiedField === "Account Number" ? (
                      <CheckIcon className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* IFSC & Bank */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                        IFSC Code
                      </span>
                      <span className="font-mono font-bold text-stone-900 text-xs">
                        HDFC0001234
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("HDFC0001234", "IFSC Code")}
                      className="p-1.5 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-900 transition"
                      title="Copy IFSC"
                    >
                      {copiedField === "IFSC Code" ? (
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                      Bank & Branch
                    </span>
                    <span className="font-bold text-stone-900 text-xs truncate block">
                      HDFC Bank, Fort Branch
                    </span>
                  </div>
                </div>

                {/* Unified Payments UPI */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                      UPI Virtual Payment Address
                    </span>
                    <span className="font-mono font-bold text-[#D6482B] text-sm">
                      settlement@auctionspace
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard("settlement@auctionspace", "UPI ID")
                    }
                    className="p-1.5 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-900 transition"
                    title="Copy UPI ID"
                  >
                    {copiedField === "UPI ID" ? (
                      <CheckIcon className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* VERIFICATION PROTOCOL STEPS */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                <h4>Settlement Verification Protocol</h4>
              </div>

              <div className="space-y-3 text-xs text-stone-500">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p>
                    Execute wire transfer using any of the verified treasury bank channels shown above.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p>
                    Capture the complete confirmation screen or download the official transaction receipt PDF/image.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p>
                    Upload the proof with the exact transferred amount. Our finance team verifies and clears your ledger in &lt;24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitCommission;
