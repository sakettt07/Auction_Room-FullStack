import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  XMarkIcon,
  EnvelopeIcon,
  LockClosedIcon,
  KeyIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { FiEye, FiEyeOff } from "react-icons/fi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const STEPS = {
  EMAIL: "email",
  OTP: "otp",
  OPTIONS: "options",
  SUCCESS: "success",
};

const ForgotPasswordModal = ({ isOpen, onClose, defaultEmail = "", onPasswordRetrieved }) => {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // OTP state (6 digits)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Recovery & reset state
  const [resetToken, setResetToken] = useState("");
  const [hasOldPassword, setHasOldPassword] = useState(true);
  const [activeOption, setActiveOption] = useState(null); // 'reveal' | 'reset'

  // Revealed password state
  const [revealedPassword, setRevealedPassword] = useState("");
  const [showRevealedPassword, setShowRevealedPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // New password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset all fields when opened/closed
  useEffect(() => {
    if (isOpen) {
      setStep(STEPS.EMAIL);
      setEmail(defaultEmail || "");
      setErrorMsg("");
      setOtp(["", "", "", "", "", ""]);
      setActiveOption(null);
      setRevealedPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
      setCopied(false);
    }
  }, [isOpen, defaultEmail]);

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // 1. Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/password/forgot`,
        { email: trimmedEmail },
        { withCredentials: true }
      );
      toast.success(res.data?.message || "6-digit code sent to your email!");
      setStep(STEPS.OTP);
      setResendCooldown(60);
      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to send verification code. Please check your email or try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle OTP Digits
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrorMsg("");

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setOtp(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg("");

    const code = otp.join("");
    if (code.length !== 6) {
      setErrorMsg("Please enter all 6 digits of the verification code.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/password/verify-code`,
        { email: email.trim(), otp: code },
        { withCredentials: true }
      );

      const data = res.data?.data || {};
      setResetToken(data.resetToken);
      setHasOldPassword(data.hasOldPassword !== false);
      toast.success("Code verified successfully!");
      setStep(STEPS.OPTIONS);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Invalid or expired verification code.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Option 1: Reveal Old Password
  const handleRevealPassword = async () => {
    setErrorMsg("");
    setActiveOption("reveal");

    if (revealedPassword) return; // already fetched

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/password/reveal-old`,
        { resetToken },
        {
          headers: { Authorization: `Bearer ${resetToken}` },
          withCredentials: true,
        }
      );
      setRevealedPassword(res.data?.data?.oldPassword || "");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Could not retrieve old password. Please choose 'Create a new one'.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Option 2: Reset to new password
  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setErrorMsg("");

    if (!newPassword || !confirmPassword) {
      setErrorMsg("Please fill out both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/password/reset-new`,
        {
          resetToken,
          newPassword,
          confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${resetToken}` },
          withCredentials: true,
        }
      );
      toast.success(res.data?.message || "Password updated successfully!");
      setStep(STEPS.SUCCESS);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to update password. Try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!revealedPassword) return;
    navigator.clipboard.writeText(revealedPassword);
    setCopied(true);
    toast.success("Password copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFinishLogin = () => {
    if (onPasswordRetrieved) {
      onPasswordRetrieved(email, revealedPassword || "");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 px-6 py-5 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <KeyIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Account Recovery
              </h3>
              <p className="text-xs text-stone-400">
                Secure Password Retrieval & Reset
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Step Indicator Progress */}
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-stone-400">
            <span
              className={`flex items-center gap-1.5 ${
                step === STEPS.EMAIL
                  ? "text-[#D6482B] font-bold"
                  : step !== STEPS.EMAIL
                  ? "text-emerald-600"
                  : ""
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center border text-[11px] border-current">
                1
              </span>
              Email
            </span>
            <div className="flex-1 h-0.5 mx-2 bg-stone-200">
              <div
                className={`h-full bg-[#D6482B] transition-all duration-300 ${
                  step === STEPS.EMAIL
                    ? "w-0"
                    : step === STEPS.OTP
                    ? "w-1/2"
                    : "w-full"
                }`}
              />
            </div>
            <span
              className={`flex items-center gap-1.5 ${
                step === STEPS.OTP
                  ? "text-[#D6482B] font-bold"
                  : step === STEPS.OPTIONS || step === STEPS.SUCCESS
                  ? "text-emerald-600"
                  : ""
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center border text-[11px] border-current">
                2
              </span>
              6-Digit Code
            </span>
            <div className="flex-1 h-0.5 mx-2 bg-stone-200">
              <div
                className={`h-full bg-[#D6482B] transition-all duration-300 ${
                  step === STEPS.OPTIONS || step === STEPS.SUCCESS
                    ? "w-full"
                    : "w-0"
                }`}
              />
            </div>
            <span
              className={`flex items-center gap-1.5 ${
                step === STEPS.OPTIONS || step === STEPS.SUCCESS
                  ? "text-[#D6482B] font-bold"
                  : ""
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center border text-[11px] border-current">
                3
              </span>
              Options
            </span>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ================= STEP 1: EMAIL ================= */}
          {step === STEPS.EMAIL && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center sm:text-left">
                <h4 className="text-base font-bold text-stone-900">
                  Enter your registered email
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  We'll send a 6-digit verification code to your email. You can then choose whether to view your old password or set a new one.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <EnvelopeIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. collector@auction.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#D6482B] focus:ring-4 focus:ring-orange-500/10 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-md shadow-orange-500/25 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Sending 6-Digit Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= STEP 2: OTP VERIFICATION ================= */}
          {step === STEPS.OTP && (
            <div className="space-y-5">
              <div className="text-center">
                <h4 className="text-base font-bold text-stone-900">
                  Check your inbox for 6-digit code
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  We've sent a code to{" "}
                  <strong className="text-stone-800">{email}</strong>
                </p>
              </div>

              {/* 6-Digit Inputs */}
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e.key)}
                    className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-black rounded-xl bg-stone-50 border-2 border-stone-200 text-stone-900 focus:bg-white focus:border-[#D6482B] focus:ring-4 focus:ring-orange-500/15 focus:outline-none transition"
                  />
                ))}
              </div>

              {/* Countdown & Resend */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(STEPS.EMAIL)}
                  className="hover:text-stone-800 underline transition cursor-pointer"
                >
                  Change email address
                </button>

                {resendCooldown > 0 ? (
                  <span className="text-stone-400">
                    Resend code in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="font-bold text-[#D6482B] hover:text-[#b33a22] transition cursor-pointer"
                  >
                    Resend code
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || otp.join("").length !== 6}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-md shadow-orange-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code & Continue</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= STEP 3: OPTIONS (OLD PASSWORD OR NEW ONE) ================= */}
          {step === STEPS.OPTIONS && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                  <ShieldCheckIcon className="w-4 h-4" />
                  Code Verified Successfully
                </div>
                <h4 className="text-lg font-extrabold text-stone-900">
                  How would you like to proceed?
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Select either option below to recover access to your account.
                </p>
              </div>

              {/* Two Choice Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Option 1: Want to know your old password */}
                <button
                  type="button"
                  onClick={handleRevealPassword}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    activeOption === "reveal"
                      ? "border-[#D6482B] bg-orange-50/50 shadow-md ring-2 ring-orange-500/20"
                      : "border-stone-200 bg-white hover:border-orange-300 hover:bg-stone-50/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center">
                        <KeyIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                        Quick View
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-stone-900 leading-snug">
                      Want to know your old password?
                    </h5>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Retrieve and view your current password directly without changing it.
                    </p>
                  </div>
                  <span className="mt-3 text-xs font-bold text-[#D6482B] flex items-center gap-1">
                    Show My Password →
                  </span>
                </button>

                {/* Option 2: Create a new one */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveOption("reset");
                    setErrorMsg("");
                  }}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    activeOption === "reset"
                      ? "border-[#D6482B] bg-orange-50/50 shadow-md ring-2 ring-orange-500/20"
                      : "border-stone-200 bg-white hover:border-orange-300 hover:bg-stone-50/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <LockClosedIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Recommended
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-stone-900 leading-snug">
                      Create a new one
                    </h5>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Set a brand new secure password for your Auction Space account.
                    </p>
                  </div>
                  <span className="mt-3 text-xs font-bold text-[#D6482B] flex items-center gap-1">
                    Set New Password →
                  </span>
                </button>
              </div>

              {/* Sub-Panel for Option 1: Reveal Password */}
              {activeOption === "reveal" && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Your Current Password
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircleIcon className="w-3.5 h-3.5" /> Decrypted securely
                    </span>
                  </div>

                  {loading ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2 text-stone-500">
                      <ArrowPathIcon className="w-5 h-5 animate-spin text-[#D6482B]" />
                      <span className="text-xs">Decrypting password...</span>
                    </div>
                  ) : revealedPassword ? (
                    <div className="space-y-3">
                      <div className="relative flex items-center">
                        <input
                          type={showRevealedPassword ? "text" : "password"}
                          readOnly
                          value={revealedPassword}
                          className="w-full pl-4 pr-24 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 font-mono text-base font-bold select-all focus:outline-none"
                        />
                        <div className="absolute right-2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setShowRevealedPassword((prev) => !prev)}
                            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                            title={showRevealedPassword ? "Hide password" : "Show password"}
                          >
                            {showRevealedPassword ? (
                              <FiEyeOff className="w-4 h-4" />
                            ) : (
                              <FiEye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={copyToClipboard}
                            className="p-1.5 text-[#D6482B] hover:bg-orange-50 rounded-lg transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                            title="Copy to clipboard"
                          >
                            {copied ? (
                              <ClipboardDocumentCheckIcon className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <ClipboardDocumentIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={handleFinishLogin}
                          className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Proceed to Sign In</span>
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveOption("reset");
                            setErrorMsg("");
                          }}
                          className="py-3 px-4 rounded-xl font-semibold text-xs text-stone-600 hover:bg-stone-200/70 transition cursor-pointer"
                        >
                          Change it instead
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Sub-Panel for Option 2: Reset New Password */}
              {activeOption === "reset" && (
                <form
                  onSubmit={handleResetPassword}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 animate-in fade-in duration-200"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#D6482B] focus:ring-2 focus:ring-orange-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                      >
                        {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your new password"
                        className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#D6482B] focus:ring-2 focus:ring-orange-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                      >
                        {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow transition disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Update Password</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ================= STEP 4: SUCCESS CONFIRMATION ================= */}
          {step === STEPS.SUCCESS && (
            <div className="text-center py-6 space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircleIcon className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-black text-stone-900">
                  Password Updated!
                </h4>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Your new password has been saved securely. You can now log into Auction Space with your updated credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={handleFinishLogin}
                className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-md shadow-orange-500/25 transition cursor-pointer"
              >
                <span>Back to Sign In</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
            End-to-End Encrypted Verification
          </span>
          <button
            onClick={onClose}
            className="font-medium hover:text-stone-800 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
