import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  BoltIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaDiscord,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to AuctionSpace VIP Drops!");
    setEmail("");
  };

  return (
    <footer className="w-full bg-white border-t border-stone-200/80 text-stone-600 pt-12 sm:pt-16 pb-10 sm:pb-12 mt-16 sm:mt-20">
      {/* Top Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 border-b border-stone-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-0 rounded-2xl sm:rounded-none bg-stone-50/70 sm:bg-transparent border sm:border-0 border-stone-100">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-[#D6482B] flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">Protected Escrow</p>
              <p className="text-[10px] sm:text-xs text-stone-500 truncate">Secure payment gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-0 rounded-2xl sm:rounded-none bg-stone-50/70 sm:bg-transparent border sm:border-0 border-stone-100">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CurrencyDollarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">8% Platform Fee</p>
              <p className="text-[10px] sm:text-xs text-stone-500 truncate">0% on first listing</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-0 rounded-2xl sm:rounded-none bg-stone-50/70 sm:bg-transparent border sm:border-0 border-stone-100">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <BoltIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">Real-Time Bids</p>
              <p className="text-[10px] sm:text-xs text-stone-500 truncate">Instant synchronized ticks</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-0 rounded-2xl sm:rounded-none bg-stone-50/70 sm:bg-transparent border sm:border-0 border-stone-100">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <CheckBadgeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">Verified Sellers</p>
              <p className="text-[10px] sm:text-xs text-stone-500 truncate">Strict authenticity audit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links - Optimized for smaller screens to eliminate dead space */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Brand Info & Newsletter (Full width on mobile/tablet, 5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-stone-900">
                  Auction
                  <span className="text-[#D6482B]">Space</span>
                </span>
              </Link>

              {/* Social Channels */}
              <div className="flex items-center gap-2 text-stone-400">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-[#D6482B] hover:text-white flex items-center justify-center transition"
                >
                  <FaTwitter className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-[#D6482B] hover:text-white flex items-center justify-center transition"
                >
                  <FaInstagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-[#D6482B] hover:text-white flex items-center justify-center transition"
                >
                  <FaLinkedinIn className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Discord"
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-[#D6482B] hover:text-white flex items-center justify-center transition"
                >
                  <FaDiscord className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <p className="text-stone-500 text-sm leading-relaxed max-w-xl">
              The premier digital auction marketplace for luxury goods, rare collectibles, fine art, and electronics. Transparent bidding, verified provenance, and guaranteed fast payouts.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 w-full max-w-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Subscribe to VIP Auction Alerts
              </p>
              <div className="flex items-center gap-2 w-full">
                <div className="relative flex-1">
                  <EnvelopeIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D6482B] hover:bg-[#b33a22] text-white text-xs sm:text-sm font-bold transition shadow-sm flex-shrink-0 cursor-pointer"
                >
                  Join VIP
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Link Columns (7 cols on lg, responsive 2/3 col subgrid on smaller screens) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 w-full pt-2 lg:pt-0">
            {/* Column 1: Marketplace */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6482B]"></span>
                <span>Marketplace</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link to="/auctions" className="hover:text-[#D6482B] transition block">
                    Live Auctions
                  </Link>
                </li>
                <li>
                  <Link to="/auctions" className="hover:text-[#D6482B] transition block">
                    Upcoming Drops
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="hover:text-[#D6482B] transition block">
                    Top Bidders
                  </Link>
                </li>
                <li>
                  <Link to="/auctions" className="hover:text-[#D6482B] transition block">
                    Featured Lots
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: For Auctioneers */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>For Sellers</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link to="/create-auction" className="hover:text-[#D6482B] transition block">
                    Create Auction
                  </Link>
                </li>
                <li>
                  <Link to="/view-my-auctions" className="hover:text-[#D6482B] transition block">
                    My Active Lots
                  </Link>
                </li>
                <li>
                  <Link to="/submit-commission" className="hover:text-[#D6482B] transition block">
                    Commission Proof
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works-info" className="hover:text-[#D6482B] transition block">
                    Fee Schedule (8%)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform & Trust */}
            <div className="space-y-3 col-span-2 sm:col-span-1 border-t sm:border-t-0 border-stone-100 pt-4 sm:pt-0">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                <span>AuctionSpace</span>
              </h4>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs sm:text-sm">
                <li>
                  <Link to="/about" className="hover:text-[#D6482B] transition block">
                    About Mission
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works-info" className="hover:text-[#D6482B] transition block">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#D6482B] transition block">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#D6482B] transition block">
                    Trust & Escrow
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} AuctionSpace Inc. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-Time Engine Live
          </span>
          <Link to="/about" className="hover:text-stone-700 transition">
            Privacy Policy
          </Link>
          <Link to="/about" className="hover:text-stone-700 transition">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
