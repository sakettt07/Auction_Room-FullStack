import { login } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import ForgotPasswordModal from "../custom-components/ForgotPasswordModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const { loading, isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    const nextErrors = {};
    if (!email) {
      nextErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    dispatch(login(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50/70 via-white to-stone-50/50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
              Auction
              <span className="text-[#D6482B]">Space</span>
            </span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#D6482B] border border-orange-200/60 mb-3">
            <SparklesIcon className="w-3.5 h-3.5" />
            Member Access
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Welcome back, Collector
          </h1>
          <p className="text-stone-500 text-sm mt-1.5">
            Sign in to place bids, manage your watchlists, and view live auctions.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl shadow-stone-900/5 p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none transition ${
                    errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-400/20"
                      : "border-stone-200 focus:border-[#D6482B] focus:ring-4 focus:ring-orange-500/10"
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                  <span>•</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-semibold text-[#D6482B] hover:text-[#b33a22] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <LockClosedIcon className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  className={`w-full pl-11 pr-11 py-3 rounded-xl bg-stone-50 border text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none transition ${
                    errors.password
                      ? "border-red-400 focus:ring-2 focus:ring-red-400/20"
                      : "border-stone-200 focus:border-[#D6482B] focus:ring-4 focus:ring-orange-500/10"
                  }`}
                  placeholder="Enter your password (min. 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                  <span>•</span> {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to AuctionSpace</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to SignUp */}
          <div className="mt-6 pt-6 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-500">
              Don't have an account yet?{" "}
              <Link
                to="/sign-up"
                className="font-bold text-[#D6482B] hover:text-[#b33a22] transition-colors"
              >
                Create an account →
              </Link>
            </p>
          </div>
        </div>

        {/* Trust signals footer */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs font-semibold text-stone-400">
          <span className="flex items-center gap-1">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
            256-Bit SSL Encrypted
          </span>
          <span className="flex items-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-emerald-600" />
            Verified Escrow Protection
          </span>
        </div>

      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultEmail={email}
        onPasswordRetrieved={(retrievedEmail, retrievedPassword) => {
          if (retrievedEmail) setEmail(retrievedEmail);
          if (retrievedPassword) setPassword(retrievedPassword);
          if (errors.email || errors.password) setErrors({});
        }}
      />
    </div>
  );
};

export default Login;
