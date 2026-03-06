import { login } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { loading, isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    const nextErrors = {};
    if (!email) {
      nextErrors.email = "Email is required";
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
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <div className="bg-white/80 backdrop-blur-sm mx-auto w-full max-w-lg px-6 flex flex-col gap-6 items-center py-8 justify-center rounded-2xl shadow-lg">
          <div className="w-full text-center space-y-2">
            <p className="text-sm font-semibold tracking-wide text-[#d6482b]/80 uppercase">
              Welcome back
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Sign in to Auction Room
            </h1>
            <p className="text-sm text-slate-500">
              Access your dashboard, manage auctions, and track your bids.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`text-[16px] py-2 px-3 rounded-md bg-slate-50 border ${
                  errors.email ? "border-red-400" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-[#d6482b]/60`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
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
                  placeholder="Enter your password"
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

            <button
              className="bg-[#d6482b] font-semibold hover:bg-[#b8381e] transition-all duration-300 text-base md:text-lg py-2.5 px-4 rounded-md text-white mx-auto w-full shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
