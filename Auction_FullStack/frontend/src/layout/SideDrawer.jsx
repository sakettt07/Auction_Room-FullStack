import React, { useState } from "react";
import { RiAuctionFill } from "react-icons/ri";
import { MdLeaderboard, MdDashboard } from "react-icons/md";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosCreate } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { Link } from "react-router-dom";

const SideDrawer = () => {
  const [open, setOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
  };

  const closeMenu = () => setOpen(false);

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#f6f4f0]/95 border-b border-slate-200 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
            <span className="text-2xl font-semibold">
              Prime<span className="text-[#D6482b]">Bid</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-800">
            <Link
              to="/auctions"
              className="flex items-center gap-1 hover:text-[#D6482b] transition-colors"
            >
              <RiAuctionFill /> Auctions
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center gap-1 hover:text-[#D6482b] transition-colors"
            >
              <MdLeaderboard /> Leaderboard
            </Link>
            <Link
              to="/how-it-works-info"
              className="flex items-center gap-1 hover:text-[#D6482b] transition-colors"
            >
              <SiGooglesearchconsole /> How it works
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-1 hover:text-[#D6482b] transition-colors"
            >
              <BsFillInfoSquareFill /> About Us
            </Link>
            {isAuthenticated && user && (
              <Link
                to="/me"
                className="flex items-center gap-1 hover:text-[#D6482b] transition-colors"
              >
                <FaUserCircle /> Profile
              </Link>
            )}
            {isAuthenticated && user && user.role === "Auctioneer" && (
              <>
                <Link
                  to="/submit-commission"
                  className="flex items-center gap-1 hover:text-[#D6482b] transition-colors"
                >
                  <FaFileInvoiceDollar /> Commission
                </Link>
                <Link
                  to="/create-auction"
                  className="flex items-center gap-1 hover:text-[#D6482b] transition-colors"
                >
                  <IoIosCreate /> Create
                </Link>
                <Link
                  to="/view-my-auctions"
                  className="flex items-center gap-1 hover:text-[#D6482b] transition-colors"
                >
                  <FaEye /> My auctions
                </Link>
              </>
            )}
            {isAuthenticated && user && user.role === "Super Admin" && (
              <Link
                to="/dashboard"
                className="flex items-center gap-1 hover:text-[#D6482b] transition-colors"
              >
                <MdDashboard /> Dashboard
              </Link>
            )}
          </nav>

          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/sign-up"
                  className="bg-[#D6482B] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#b8381e] transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="border border-[#DECCBE] text-sm font-semibold text-[#DECCBE] px-4 py-2 rounded-md hover:bg-[#fffefd] hover:text-[#fdba88] transition-colors"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-[#D6482B] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#b8381e] transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md bg-[#D6482B] text-white text-2xl p-2 hover:bg-[#b8381e] transition-colors"
            onClick={() => setOpen((prev) => !prev)}
          >
            <GiHamburgerMenu />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-slate-200 bg-[#f6f4f0]">
            <div className="px-4 py-3 flex flex-col gap-3 text-sm font-semibold text-slate-800">
              <Link
                to="/auctions"
                onClick={closeMenu}
                className="flex items-center gap-2 hover:text-[#D6482b]"
              >
                <RiAuctionFill /> Auctions
              </Link>
              <Link
                to="/leaderboard"
                onClick={closeMenu}
                className="flex items-center gap-2 hover:text-[#D6482b]"
              >
                <MdLeaderboard /> Leaderboard
              </Link>
              {isAuthenticated && user && user.role === "Auctioneer" && (
                <>
                  <Link
                    to="/submit-commission"
                    onClick={closeMenu}
                    className="flex items-center gap-2 hover:text-[#D6482b]"
                  >
                    <FaFileInvoiceDollar /> Submit Commission
                  </Link>
                  <Link
                    to="/create-auction"
                    onClick={closeMenu}
                    className="flex items-center gap-2 hover:text-[#D6482b]"
                  >
                    <IoIosCreate /> Create Auction
                  </Link>
                  <Link
                    to="/view-my-auctions"
                    onClick={closeMenu}
                    className="flex items-center gap-2 hover:text-[#D6482b]"
                  >
                    <FaEye /> View My Auctions
                  </Link>
                </>
              )}
              {isAuthenticated && user && user.role === "Super Admin" && (
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center gap-2 hover:text-[#D6482b]"
                >
                  <MdDashboard /> Dashboard
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/me"
                  onClick={closeMenu}
                  className="flex items-center gap-2 hover:text-[#D6482b]"
                >
                  <FaUserCircle /> Profile
                </Link>
              )}
              <Link
                to="/how-it-works-info"
                onClick={closeMenu}
                className="flex items-center gap-2 hover:text-[#D6482b]"
              >
                <SiGooglesearchconsole /> How it works
              </Link>
              <Link
                to="/about"
                onClick={closeMenu}
                className="flex items-center gap-2 hover:text-[#D6482b]"
              >
                <BsFillInfoSquareFill /> About Us
              </Link>

              <div className="pt-2 flex flex-col gap-2">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/sign-up"
                      onClick={closeMenu}
                      className="bg-[#D6482B] text-white text-sm font-semibold px-4 py-2 rounded-md text-center hover:bg-[#b8381e]"
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="border border-[#DECCBE] text-sm font-semibold text-[#DECCBE] px-4 py-2 rounded-md text-center hover:bg-[#fffefd] hover:text-[#fdba88]"
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="bg-[#D6482B] text-white text-sm font-semibold px-4 py-2 rounded-md text-center hover:bg-[#b8381e]"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-[#f6f4f0]/95 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 text-xs md:text-sm text-stone-500">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="bg-white text-stone-500 p-2 text-lg rounded-sm hover:text-blue-700 transition-colors"
            >
              <FaFacebook />
            </Link>
            <Link
              to="/"
              className="bg-white text-stone-500 p-2 text-lg rounded-sm hover:text-pink-500 transition-colors"
            >
              <RiInstagramFill />
            </Link>
            <Link
              to="/contact"
              className="font-semibold hover:text-[#d6482b] transition-colors"
            >
              Contact Us
            </Link>
          </div>

          <div className="text-right leading-tight">
            <p>&copy; PrimeBid, LLC.</p>
            <p>
              Designed by{" "}
              <Link
                to="/"
                className="font-semibold hover:text-[#d6482b] transition-colors"
              >
                Saket
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default SideDrawer;
