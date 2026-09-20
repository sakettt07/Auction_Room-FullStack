import React, { useState, useEffect } from "react";
import { RiAuctionFill } from "react-icons/ri";
import { MdLeaderboard, MdDashboard } from "react-icons/md";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaFacebook, FaUserCircle, FaEye } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosCreate } from "react-icons/io";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { Link, useLocation } from "react-router-dom";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const SideDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/auctions", label: "Auctions", icon: RiAuctionFill },
    { path: "/leaderboard", label: "Leaderboard", icon: MdLeaderboard },
    {
      path: "/how-it-works-info",
      label: "How it works",
      icon: SiGooglesearchconsole,
    },
    { path: "/about", label: "About Us", icon: BsFillInfoSquareFill },
  ];

  const auctioneerLinks = [
    {
      path: "/submit-commission",
      label: "Commission",
      icon: FaFileInvoiceDollar,
    },
    { path: "/create-auction", label: "Create Auction", icon: IoIosCreate },
    { path: "/view-my-auctions", label: "My Auctions", icon: FaEye },
  ];

  return (
    <>
      {/* Floating Modern Navbar Header */}
      <header className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-7xl transition-all duration-300">
        <div
          className={`w-full rounded-full transition-all duration-300 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border ${
            scrolled
              ? "bg-white/95 backdrop-blur-xl border-stone-200/90 shadow-xl shadow-stone-900/10"
              : "bg-white/85 backdrop-blur-lg border-stone-200/70 shadow-lg shadow-stone-900/5"
          }`}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 group flex-shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
              Auction
              <span className="text-[#D6482B] group-hover:text-[#b33a22] transition-colors">
                Space
              </span>
            </span>
          </Link>

          {/* Desktop Pill Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-stone-100/80 p-1 rounded-full border border-stone-200/50">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? "bg-[#D6482B] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-950 hover:bg-white/70"
                }`}
              >
                <link.icon className="text-base" />
                {link.label}
              </Link>
            ))}

            {/* Auctioneer Dropdown */}
            {isAuthenticated && user?.role === "Auctioneer" && (
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown("auctioneer")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    auctioneerLinks.some((link) => isActive(link.path))
                      ? "bg-[#D6482B] text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-950 hover:bg-white/70"
                  }`}
                >
                  <IoIosCreate className="text-base" />
                  <span>Auctioneer</span>
                  <ChevronDownIcon className="w-3.5 h-3.5 ml-0.5" />
                </button>

                <div className="absolute top-[calc(100%+8px)] right-0 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-stone-200/80 p-1.5 z-50">
                  {auctioneerLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                        isActive(link.path)
                          ? "bg-orange-50 text-[#D6482B]"
                          : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                      }`}
                    >
                      <link.icon className="text-base text-stone-500" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Link */}
            {isAuthenticated && (
              <Link
                to="/me"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive("/me")
                    ? "bg-[#D6482B] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-950 hover:bg-white/70"
                }`}
              >
                <FaUserCircle className="text-base" />
                <span>Profile</span>
              </Link>
            )}

            {/* Admin Dashboard */}
            {isAuthenticated && user?.role === "Super Admin" && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive("/dashboard")
                    ? "bg-[#D6482B] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-950 hover:bg-white/70"
                }`}
              >
                <MdDashboard className="text-base" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Desktop Auth CTA */}
          <div className="hidden lg:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-stone-700 hover:text-[#D6482B] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/sign-up"
                  className="px-5 py-2 bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-md shadow-orange-500/20 hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-stone-500 hidden xl:inline">
                  Hi, {user?.userName || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-600 text-xs sm:text-sm font-bold rounded-full transition-colors border border-stone-200/80"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center hover:bg-stone-200 transition-colors border border-stone-200/60"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <GiHamburgerMenu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Floating Sheet */}
        <div
          className={`lg:hidden absolute top-[calc(100%+8px)] left-0 right-0 bg-white/95 backdrop-blur-2xl rounded-3xl border border-stone-200/90 shadow-2xl p-4 transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2 pointer-events-none"
          }`}
          style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
        >
          <div className="space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? "bg-[#D6482B] text-white"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <link.icon className="text-xl" />
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to="/me"
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive("/me")
                    ? "bg-[#D6482B] text-white"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <FaUserCircle className="text-xl" />
                Profile
              </Link>
            )}

            {isAuthenticated && user?.role === "Auctioneer" && (
              <div className="pt-2 border-t border-stone-100 space-y-1">
                <p className="px-4 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Auctioneer Tools
                </p>
                {auctioneerLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                      isActive(link.path)
                        ? "bg-[#D6482B] text-white"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <link.icon className="text-xl" />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {isAuthenticated && user?.role === "Super Admin" && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive("/dashboard")
                    ? "bg-[#D6482B] text-white"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <MdDashboard className="text-xl" />
                Dashboard
              </Link>
            )}

            <div className="pt-3 space-y-2 border-t border-stone-100">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="w-full py-2.5 text-center text-sm font-bold text-stone-700 border border-stone-200 rounded-full hover:bg-stone-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className="w-full py-2.5 text-center text-sm font-bold bg-[#D6482B] text-white rounded-full hover:bg-[#b33a22] transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 text-center text-sm font-bold bg-stone-100 text-stone-700 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors border border-stone-200"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Subtle spacer to position page content just right beneath the floating navbar */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default SideDrawer;
