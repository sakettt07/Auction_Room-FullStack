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
  FaShieldAlt,
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
    <footer className="w-full bg-white border-t border-stone-200/80 text-stone-600 pt-16 pb-12 mt-20">
      {/* Top Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#D6482B] flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">Protected Escrow</p>
              <p className="text-xs text-stone-500">Secure payment gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">8% Platform Fee</p>
              <p className="text-xs text-stone-500">0% on first listing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <BoltIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">Real-Time Bids</p>
              <p className="text-xs text-stone-500">Instant synchronized ticks</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <CheckBadgeIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">Verified Sellers</p>
              <p className="text-xs text-stone-500">Strict authenticity audit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-stone-900">
                Auction
                <span className="text-[#D6482B]">Space</span>
              </span>
            </Link>

            <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
              The premier digital auction marketplace for luxury goods, rare collectibles, fine art, and electronics. Transparent bidding, verified provenance, and guaranteed fast payouts.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 max-w-md">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Subscribe to VIP Auction Alerts
              </p>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <EnvelopeIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#D6482B] transition"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#D6482B] hover:bg-[#b33a22] text-white text-xs font-bold transition shadow-sm"
                >
                  Join VIP
                </button>
              </div>
            </form>
          </div>

          {/* Column 1: Marketplace */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/auctions" className="hover:text-[#D6482B] transition">
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link to="/auctions" className="hover:text-[#D6482B] transition">
                  Upcoming Drops
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-[#D6482B] transition">
                  Top Bidders
                </Link>
              </li>
              <li>
                <Link to="/auctions" className="hover:text-[#D6482B] transition">
                  Featured Lots
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: For Sellers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-4">
              For Auctioneers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/create-auction" className="hover:text-[#D6482B] transition">
                  Create Auction
                </Link>
              </li>
              <li>
                <Link to="/view-my-auctions" className="hover:text-[#D6482B] transition">
                  My Active Lots
                </Link>
              </li>
              <li>
                <Link to="/submit-commission" className="hover:text-[#D6482B] transition">
                  Commission Proof
                </Link>
              </li>
              <li>
                <Link to="/how-it-works-info" className="hover:text-[#D6482B] transition">
                  Fee Schedule (8%)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-4">
              AuctionSpace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-[#D6482B] transition">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link to="/how-it-works-info" className="hover:text-[#D6482B] transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#D6482B] transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D6482B] transition">
                  Trust & Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
        <p>© {new Date().getFullYear()} AuctionSpace Inc. All rights reserved.</p>

        <div className="flex items-center gap-6">
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
