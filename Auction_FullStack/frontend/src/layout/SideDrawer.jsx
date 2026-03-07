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
    { path: "/create-auction", label: "Create", icon: IoIosCreate },
    { path: "/view-my-auctions", label: "My auctions", icon: FaEye },
  ];

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2"
            : "bg-white/80 backdrop-blur-sm py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl sm:text-2xl font-bold">
                Auction
                <span className="text-[#D6482B] group-hover:text-[#b33a22] transition-colors">
                  Space
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-[#D6482B] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#D6482B]"
                  }`}
                >
                  <link.icon className="text-lg" />
                  {link.label}
                </Link>
              ))}

              {/* Auctioneer Dropdown */}
              {isAuthenticated && user?.role === "Auctioneer" && (
                <div className="relative group">
                  <button
                    onClick={() => toggleDropdown("auctioneer")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      auctioneerLinks.some((link) => isActive(link.path))
                        ? "bg-[#D6482B] text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#D6482B]"
                    }`}
                  >
                    <IoIosCreate className="text-lg" />
                    Auctioneer
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </button>

                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                    {auctioneerLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                          isActive(link.path)
                            ? "text-[#D6482B] font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        <link.icon className="text-lg" />
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/me")
                      ? "bg-[#D6482B] text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#D6482B]"
                  }`}
                >
                  <FaUserCircle className="text-lg" />
                  Profile
                </Link>
              )}

              {/* Admin Dashboard */}
              {isAuthenticated && user?.role === "Super Admin" && (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/dashboard")
                      ? "bg-[#D6482B] text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#D6482B]"
                  }`}
                >
                  <MdDashboard className="text-lg" />
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-[#D6482B] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className="px-5 py-2 bg-[#D6482B] text-white text-sm font-medium rounded-lg hover:bg-[#b33a22] transition-colors shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg bg-[#D6482B] text-white hover:bg-[#b33a22] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <GiHamburgerMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-x-0 top-[57px] bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
          }`}
          style={{ maxHeight: "calc(100vh - 57px)", overflowY: "auto" }}
        >
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-[#D6482B] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <link.icon className="text-xl" />
                {link.label}
              </Link>
            ))}

            {/* Mobile Profile Link */}
            {isAuthenticated && (
              <Link
                to="/me"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive("/me")
                    ? "bg-[#D6482B] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaUserCircle className="text-xl" />
                Profile
              </Link>
            )}

            {/* Mobile Auctioneer Links */}
            {isAuthenticated && user?.role === "Auctioneer" && (
              <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Auctioneer Menu
                </div>
                {auctioneerLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? "bg-[#D6482B] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <link.icon className="text-xl" />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Admin Dashboard */}
            {isAuthenticated && user?.role === "Super Admin" && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive("/dashboard")
                    ? "bg-[#D6482B] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <MdDashboard className="text-xl" />
                Dashboard
              </Link>
            )}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 space-y-2 border-t border-gray-200">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="block w-full px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block w-full px-4 py-3 text-center text-sm font-medium bg-[#D6482B] text-white rounded-lg hover:bg-[#b33a22] transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-center text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Social Links */}
            <div className="pt-4 flex items-center justify-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
              >
                <RiInstagramFill className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16 lg:h-[72px]" />
    </>
  );
};

export default SideDrawer;
