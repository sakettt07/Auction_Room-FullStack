import { register } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  LockClosedIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  ArrowRightIcon,
  CameraIcon,
  TrophyIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("Bidder"); // default to Bidder
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [stripeEmail, setStripeEmail] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    const nextErrors = {};

    if (!userName.trim()) nextErrors.userName = "Full name is required";
    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim()) nextErrors.phone = "Phone number is required";
    if (!address.trim()) nextErrors.address = "Address is required";
    if (!role) nextErrors.role = "Please select an account role";
    if (!password || password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }
    if (!profileImage) {
      nextErrors.profileImage = "Profile picture is required";
    }

    if (role === "Auctioneer") {
      if (!bankName) nextErrors.bankName = "Bank selection is required";
      if (!bankAccountNumber.trim()) nextErrors.bankAccountNumber = "Account / IFSC is required";
      if (!bankAccountName.trim()) nextErrors.bankAccountName = "Account holder name is required";
      if (!stripeEmail.trim()) {
        nextErrors.stripeEmail = "Stripe email is required for seller payouts";
      }
      if (!paypalEmail.trim()) {
        nextErrors.paypalEmail = "PayPal email is required for seller payouts";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("profileImage", profileImage);

    if (role === "Auctioneer") {
      formData.append("bankAccountName", bankAccountName);
      formData.append("bankAccountNumber", bankAccountNumber);
      formData.append("bankName", bankName);
      formData.append("stripeEmail", stripeEmail);
      formData.append("paypalEmail", paypalEmail);
    }

    dispatch(register(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfileImagePreview(reader.result);
      setProfileImage(file);
      if (errors.profileImage) setErrors({ ...errors, profileImage: null });
    };
  };

  const isAuctioneer = role === "Auctioneer";

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50/70 via-white to-stone-50/50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        
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
            Join The Marketplace
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Create Your AuctionSpace Account
          </h1>
          <p className="text-stone-500 text-sm mt-1.5 max-w-md mx-auto">
            Participate in real-time verified auctions or list premium items for global bidders.
          </p>
        </div>

        {/* SignUp Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl shadow-stone-900/5 p-6 sm:p-10">
          <form onSubmit={handleRegister} className="space-y-8">
            
            {/* 1. ROLE SELECTION CARDS */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                Select Account Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setRole("Bidder");
                    if (errors.role) setErrors({ ...errors, role: null });
                  }}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                    role === "Bidder"
                      ? "border-[#D6482B] bg-orange-50/40 ring-2 ring-[#D6482B]/20"
                      : "border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-stone-600"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      role === "Bidder"
                        ? "bg-[#D6482B] text-white"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    <TrophyIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-stone-900 text-sm">Bidder</h4>
                      {role === "Bidder" && (
                        <CheckCircleIcon className="w-4 h-4 text-[#D6482B]" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Discover exclusive drops and place live synchronized bids.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("Auctioneer");
                    if (errors.role) setErrors({ ...errors, role: null });
                  }}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                    role === "Auctioneer"
                      ? "border-[#D6482B] bg-orange-50/40 ring-2 ring-[#D6482B]/20"
                      : "border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-stone-600"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      role === "Auctioneer"
                        ? "bg-[#D6482B] text-white"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    <RocketLaunchIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-stone-900 text-sm">Auctioneer</h4>
                      {role === "Auctioneer" && (
                        <CheckCircleIcon className="w-4 h-4 text-[#D6482B]" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      List rare lots with 0% first fee & receive guaranteed payouts.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. PROFILE IMAGE AVATAR UPLOAD */}
            <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-stone-200 border-2 border-white shadow-sm flex-shrink-0">
                <img
                  src={profileImagePreview || "/placeholder_avatar.jpg"}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Profile Photo
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Clear profile image required for bidder and seller verification.
                </p>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-stone-800 bg-white border border-stone-200 hover:border-[#D6482B] hover:text-[#D6482B] shadow-sm transition">
                <CameraIcon className="w-4 h-4 text-stone-500" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={imageHandler}
                  className="hidden"
                />
              </label>
            </div>
            {errors.profileImage && (
              <p className="text-xs text-red-500 font-medium -mt-5 flex items-center gap-1">
                <span>•</span> {errors.profileImage}
              </p>
            )}

            {/* 3. PERSONAL DETAILS */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
                Personal Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => {
                        setUserName(e.target.value);
                        if (errors.userName) setErrors({ ...errors, userName: null });
                      }}
                      placeholder="e.g. Alexander Pierce"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                    />
                  </div>
                  {errors.userName && (
                    <p className="text-xs text-red-500 mt-1">{errors.userName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      placeholder="alex@example.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: null });
                      }}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Residential / Delivery Address
                  </label>
                  <div className="relative">
                    <MapPinIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setErrors({ ...errors, address: null });
                      }}
                      placeholder="Street, City, State, ZIP"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    placeholder="Min. 8 characters with a number or symbol"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* 4. AUCTIONEER PAYOUT INFORMATION (Displayed if role === 'Auctioneer') */}
            {isAuctioneer && (
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#D6482B] flex items-center justify-center">
                    <BuildingLibraryIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Auctioneer Payout Information
                    </h3>
                    <p className="text-xs text-stone-500">
                      Escrow transfers are settled to these verified accounts upon lot delivery.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Bank Name
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => {
                        setBankName(e.target.value);
                        if (errors.bankName) setErrors({ ...errors, bankName: null });
                      }}
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                    >
                      <option value="">Select Bank</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="SBI Bank">State Bank of India</option>
                      <option value="PNB">Punjab National Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Indian Overseas Bank">Indian Overseas Bank</option>
                    </select>
                    {errors.bankName && (
                      <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Account / IBAN / IFSC
                    </label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => {
                        setBankAccountNumber(e.target.value);
                        if (errors.bankAccountNumber)
                          setErrors({ ...errors, bankAccountNumber: null });
                      }}
                      placeholder="Account or IFSC"
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                    />
                    {errors.bankAccountNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.bankAccountNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={bankAccountName}
                      onChange={(e) => {
                        setBankAccountName(e.target.value);
                        if (errors.bankAccountName)
                          setErrors({ ...errors, bankAccountName: null });
                      }}
                      placeholder="Beneficiary name"
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                    />
                    {errors.bankAccountName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.bankAccountName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Stripe Payout Email
                    </label>
                    <input
                      type="email"
                      value={stripeEmail}
                      onChange={(e) => {
                        setStripeEmail(e.target.value);
                        if (errors.stripeEmail) setErrors({ ...errors, stripeEmail: null });
                      }}
                      placeholder="stripe-account@example.com"
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                    />
                    {errors.stripeEmail && (
                      <p className="text-xs text-red-500 mt-1">{errors.stripeEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      PayPal Payout Email
                    </label>
                    <input
                      type="email"
                      value={paypalEmail}
                      onChange={(e) => {
                        setPaypalEmail(e.target.value);
                        if (errors.paypalEmail) setErrors({ ...errors, paypalEmail: null });
                      }}
                      placeholder="paypal-account@example.com"
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                    />
                    {errors.paypalEmail && (
                      <p className="text-xs text-red-500 mt-1">{errors.paypalEmail}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-500">
              Already a registered member?{" "}
              <Link
                to="/login"
                className="font-bold text-[#D6482B] hover:text-[#b33a22] transition-colors"
              >
                Sign in to your account →
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs font-semibold text-stone-400">
          <span className="flex items-center gap-1">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
            Verified Marketplace Protection
          </span>
          <span className="flex items-center gap-1">
            <SparklesIcon className="w-4 h-4 text-orange-500" />
            Zero Hidden Fees
          </span>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
