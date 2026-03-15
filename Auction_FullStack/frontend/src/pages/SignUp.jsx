import { register } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
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

    if (!userName) nextErrors.userName = "Full name is required";
    if (!email) nextErrors.email = "Email is required";
    if (!phone) nextErrors.phone = "Phone number is required";
    if (!address) nextErrors.address = "Address is required";
    if (!role) nextErrors.role = "Role is required";
    if (!password || password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }
    if (!profileImage) {
      nextErrors.profileImage = "Profile image is required";
    }

    if (role === "Auctioneer") {
      if (!bankAccountName || !bankAccountNumber || !bankName) {
        nextErrors.bank = "Complete bank details are required for auctioneers";
      }
      if (!stripeEmail) {
        nextErrors.stripeEmail = "Stripe email is required for auctioneers";
      }
      if (!paypalEmail) {
        nextErrors.paypalEmail = "PayPal email is required for auctioneers";
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
    };
  };

  const isAuctioneer = role === "Auctioneer";

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <div className="bg-white/80 backdrop-blur-sm mx-auto w-full h-auto px-4 sm:px-6 flex flex-col gap-6 items-center py-8 justify-center rounded-2xl shadow-lg max-w-4xl">
          <div className="w-full text-center space-y-2">
            <p className="text-sm font-semibold tracking-wide text-[#d6482b]/80 uppercase">
              Join the marketplace
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Create your Auction Room account
            </h1>
            <p className="text-sm text-slate-500">
              Register as a bidder or auctioneer and start participating in
              premium auctions.
            </p>
          </div>

          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={handleRegister}
          >
            <p className="font-semibold text-xl md:text-2xl">
              Personal Details
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-sm font-medium text-stone-600">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={`text-[16px] py-2 px-3 rounded-md bg-slate-50 border ${
                    errors.userName ? "border-red-400" : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-[#d6482b]/60`}
                />
                {errors.userName && (
                  <p className="text-xs text-red-500 mt-1">{errors.userName}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-1">
                <label className="text-sm font-medium text-stone-600">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`text-[16px] py-2 px-3 rounded-md bg-slate-50 border ${
                    errors.email ? "border-red-400" : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-[#d6482b]/60`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-sm font-medium text-stone-600">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`text-[16px] py-2 px-3 rounded-md bg-slate-50 border ${
                    errors.phone ? "border-red-400" : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-[#d6482b]/60`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-1">
                <label className="text-sm font-medium text-stone-600">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`text-[16px] py-2 px-3 rounded-md bg-slate-50 border ${
                    errors.address ? "border-red-400" : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-[#d6482b]/60`}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-sm font-medium text-stone-600">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`text-[16px] py-2 px-3 rounded-md bg-slate-50 border ${
                    errors.role ? "border-red-400" : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-[#d6482b]/60`}
                >
                  <option value="">Select Role</option>
                  <option value="Auctioneer">Auctioneer</option>
                  <option value="Bidder">Bidder</option>
                </select>
                {errors.role && (
                  <p className="text-xs text-red-500 mt-1">{errors.role}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-1">
                <label className="text-sm font-medium text-stone-600">
                  Password
                </label>
                <div
                  className={`flex items-center rounded-md bg-slate-50 border ${
                    errors.password ? "border-red-400" : "border-slate-200"
                  } focus-within:ring-2 focus-within:ring-[#d6482b]/60`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 text-[16px] py-2 px-3 bg-transparent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="px-3 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-1 gap-2">
              <label className="text-sm font-medium text-stone-600">
                Profile Image
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={
                    profileImagePreview
                      ? profileImagePreview
                      : "/imageHolder.jpg"
                  }
                  alt="profileImagePreview"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <input type="file" accept="image/*" onChange={imageHandler} />
              </div>
              {errors.profileImage && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.profileImage}
                </p>
              )}
            </div>

            {/* Payment methods - only when auctioneer */}
            <div className="flex flex-col gap-4">
              <label className="font-semibold text-xl md:2xl flex flex-col">
                Payment Method Details
                <span className="text-[12px] text-stone-500">
                  Visible and required only if you are registering as an
                  Auctioneer
                </span>
              </label>

              {isAuctioneer && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[16px] text-stone-500">
                      Bank Details
                    </label>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="text-[16px] py-2 px-3 bg-slate-50 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#d6482b]/60 sm:flex-1"
                      >
                        <option value="">Select Your Bank</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="Indian Overseas Bank">
                          Indian Overseas Bank
                        </option>
                        <option value="ICICI">ICICI</option>
                        <option value="PNB">PNB</option>
                        <option value="SBI Bank">SBI Bank</option>
                      </select>
                      <input
                        type="text"
                        value={bankAccountNumber}
                        placeholder="IBAN / IFSC"
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        className="text-[16px] py-2 px-3 bg-slate-50 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#d6482b]/60 sm:flex-1"
                      />
                      <input
                        type="text"
                        value={bankAccountName}
                        placeholder="Bank Account Username"
                        onChange={(e) => setBankAccountName(e.target.value)}
                        className="text-[16px] py-2 px-3 bg-slate-50 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#d6482b]/60 sm:flex-1"
                      />
                    </div>
                    {errors.bank && (
                      <p className="text-xs text-red-500 mt-1">{errors.bank}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[16px] text-stone-600 font-semibold">
                      Stripe & PayPal
                    </label>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                      <input
                        type="email"
                        value={stripeEmail}
                        placeholder="Stripe Email"
                        onChange={(e) => setStripeEmail(e.target.value)}
                        className="text-[16px] py-2 px-3 bg-slate-50 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#d6482b]/60 sm:flex-1"
                      />
                      <input
                        type="email"
                        value={paypalEmail}
                        placeholder="PayPal Email"
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="text-[16px] py-2 px-3 bg-slate-50 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#d6482b]/60 sm:flex-1"
                      />
                    </div>
                    {(errors.stripeEmail || errors.paypalEmail) && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.stripeEmail || errors.paypalEmail}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              className="bg-[#d6482b] w-full max-w-md font-semibold hover:bg-[#b8381e] transition-all duration-300 text-base md:text-lg py-2.5 px-4 rounded-md text-white mx-auto my-4 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SignUp;
