import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import UpcomingBannerCarousel from "./home-sub-components/UpcomingBannerCarousel";
import Leaderboard from "./home-sub-components/Leaderboard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "react-toastify";
import {
  RocketLaunchIcon,
  TrophyIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BellAlertIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const heroRef = useRef(null);
  const trustBarRef = useRef(null);
  const statsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuredRef = useRef(null);
  const upcomingRef = useRef(null);
  const leaderboardRef = useRef(null);
  const sellerCtaRef = useRef(null);
  const dropCtaRef = useRef(null);

  const trustFeatures = [
    {
      title: "8% Platform Fee",
      text: "0% on your first auction. Keep 100% of hammer value.",
      icon: CurrencyDollarIcon,
      accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Daily Live Auctions",
      text: "Hundreds of authenticated items auctioned every week.",
      icon: ClockIcon,
      accent: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "100% Verified Sellers",
      text: "Rigorous verification & provenance audit for every lot.",
      icon: ShieldCheckIcon,
      accent: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Protected Escrow",
      text: "Funds released only upon buyer confirmation & delivery.",
      icon: CheckCircleIcon,
      accent: "bg-teal-50 text-teal-600 border-teal-100",
    },
    {
      title: "Instant Payouts",
      text: "Auctioneers receive proceeds swiftly once timer ends.",
      icon: RocketLaunchIcon,
      accent: "bg-orange-50 text-[#D6482B] border-orange-100",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Post Your Items",
      description: "Auctioneers list rare goods with reserve prices and authenticated media.",
      icon: RocketLaunchIcon,
    },
    {
      step: "02",
      title: "Real-Time Bidding",
      description: "Buyers worldwide compete with transparent, live synchronized bids.",
      icon: ArrowTrendingUpIcon,
    },
    {
      step: "03",
      title: "Winning the Auction",
      description: "The highest bid when the countdown reaches zero wins the lot immediately.",
      icon: TrophyIcon,
    },
    {
      step: "04",
      title: "Escrow & Delivery",
      description: "Secure payment verification, insured courier tracking, and fast payout.",
      icon: ShieldCheckIcon,
    },
  ];

  const stats = [
    { value: "12+", label: "Active Live Bidders", icon: UserGroupIcon },
    { value: "40+", label: "Completed Auctions", icon: TrophyIcon },
    { value: "₹3L+", label: "Total Traded Volume", icon: CurrencyDollarIcon },
    { value: "98%", label: "Successful Settlements", icon: SparklesIcon },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You are on the VIP Drop list! Alerts enabled.");
    setNewsletterEmail("");
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      if (heroRef.current) {
        gsap.from(heroRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: "power2.out",
        });
      }

      // Feature bar
      if (trustBarRef.current?.children) {
        gsap.from(trustBarRef.current.children, {
          opacity: 0,
          y: 20,
          stagger: 0.08,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: trustBarRef.current,
            start: "top 90%",
          },
        });
      }

      // Stats
      if (statsRef.current?.children) {
        gsap.from(statsRef.current.children, {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          },
        });
      }

      // How it works
      if (howItWorksRef.current?.children) {
        gsap.from(howItWorksRef.current.children, {
          opacity: 0,
          y: 25,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: "top 85%",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50/60 via-white to-stone-50/50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16 flex flex-col gap-14 sm:gap-18">
        
        {/* 1. HERO SECTION */}
        <section ref={heroRef} className="text-center max-w-4xl mx-auto pt-2 pb-2">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase bg-orange-50 text-[#D6482B] border border-orange-200/80 mb-6 shadow-sm">
            <SparklesIcon className="w-4 h-4 text-[#D6482B]" />
            <span>Transparent Digital Auctions • 0% First-Time Seller Fee</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-stone-900 tracking-tight leading-[1.08] mb-6">
            Discover Rare & Luxury Assets.{" "}
            <span className="bg-gradient-to-r from-[#D6482B] via-orange-600 to-amber-600 bg-clip-text text-transparent">
              Compete Live.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-stone-600 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Join thousands of collectors and verified auctioneers worldwide. Experience real-time bidding, certified item provenance, and guaranteed escrow protection.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auctions"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all duration-300"
            >
              <span>Explore Live Auctions</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>

            {isAuthenticated ? (
              user?.role === "Super Admin" ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-stone-800 bg-white border border-stone-200/90 hover:border-[#D6482B] hover:text-[#D6482B] shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span>Admin Dashboard</span>
                  <RocketLaunchIcon className="w-5 h-5 text-[#D6482B]" />
                </Link>
              ) : (
                <Link
                  to="/create-auction"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-stone-800 bg-white border border-stone-200/90 hover:border-[#D6482B] hover:text-[#D6482B] shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span>Post An Auction</span>
                  <RocketLaunchIcon className="w-5 h-5 text-[#D6482B]" />
                </Link>
              )
            ) : (
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-stone-800 bg-white border border-stone-200/90 hover:border-[#D6482B] hover:text-[#D6482B] shadow-sm hover:shadow-md transition-all duration-300"
              >
                <span>Register to Bid</span>
                <ChevronRightIcon className="w-5 h-5 text-stone-400" />
              </Link>
            )}
          </div>

          {/* Quick Metrics Trust Line */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-stone-500">
            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600" /> 100% Escrow Protected
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600" /> Real-Time Bidding Engine
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600" /> 8% Transparent Fee
            </span>
          </div>
        </section>

        {/* 2. UPCOMING AUCTION BANNER CAROUSEL (3s auto-rotating) */}
        <section>
          <UpcomingBannerCarousel />
        </section>

        {/* 3. HORIZONTAL TRUST FEATURES BAR (Replaces the old sidebar cards) */}
        <section>
          <div
            ref={trustBarRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {trustFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3.5 ${feat.accent}`}
                  >
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm mb-1 group-hover:text-[#D6482B] transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-stone-500 text-xs leading-relaxed">
                    {feat.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FEATURED AUCTIONS (Newest products first, dynamic category tabs) */}
        <section ref={featuredRef}>
          <FeaturedAuctions />
        </section>

        {/* 5. STATS SUMMARY BAR */}
        <section>
          <div
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-stone-900/10"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D6482B]/20 text-[#D6482B] flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-stone-300 text-xs sm:text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. AUCTIONS FOR TODAY / UPCOMING DROPS */}
        <section ref={upcomingRef}>
          <UpcomingAuctions />
        </section>

        {/* 7. HOW IT WORKS SECTION */}
        <section className="w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#D6482B] border border-orange-200/60 mb-2">
              <SparklesIcon className="w-3.5 h-3.5" />
              Simple & Transparent
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              How AuctionSpace Works
            </h2>
            <p className="text-stone-500 text-sm sm:text-base mt-2">
              From the initial lot listing to the final hammer drop, our marketplace is built for trust and speed.
            </p>
          </div>

          <div
            ref={howItWorksRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-black text-[#D6482B] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200/60">
                      STEP {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-stone-50 text-stone-700 flex items-center justify-center group-hover:bg-[#D6482B] group-hover:text-white transition-all">
                      <item.icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-lg text-stone-900 mb-2 group-hover:text-[#D6482B] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-stone-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center text-xs font-bold text-stone-400 group-hover:text-[#D6482B] transition-colors">
                  <span>Learn more</span>
                  <ChevronRightIcon className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. HIGH-CONVERTING SELLER CTA SECTION (NEW CTA 1) */}
        <section ref={sellerCtaRef}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-8 sm:p-12 shadow-xl">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-4">
                <FireIcon className="w-3.5 h-3.5" />
                For Auctioneers & Collectors
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
                Turn Your Rare Assets Into Maximum Value.
              </h3>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8">
                Reach thousands of verified collectors globally. Enjoy a special <span className="text-white font-bold underline decoration-orange-500">0% introductory commission fee</span> on your first listing with guaranteed 24-hour settlement upon delivery.
              </p>

              <div className="flex flex-wrap gap-4">
                {user?.role === "Super Admin" ? (
                  <Link
                    to="/dashboard"
                    className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 text-white shadow-lg transition-all"
                  >
                    Open Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/create-auction"
                    className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 text-white shadow-lg transition-all"
                  >
                    List An Auction Today
                  </Link>
                )}
                <Link
                  to="/how-it-works-info"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                >
                  View Seller Guidelines
                </Link>
              </div>
            </div>

            {/* Decorative background glow */}
            <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#D6482B]/20 blur-3xl pointer-events-none"></div>
          </div>
        </section>

        {/* 9. TOP BIDDERS LEADERBOARD */}
        <section ref={leaderboardRef}>
          <Leaderboard />
        </section>

        {/* 10. VIP DROP ALERTS CTA SECTION (NEW CTA 2) */}
        <section ref={dropCtaRef}>
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-md text-center max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#D6482B] flex items-center justify-center mb-5 shadow-sm">
              <BellAlertIcon className="w-7 h-7" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-3">
              Never Miss A High-Demand Auction Drop
            </h3>

            <p className="text-stone-500 text-sm sm:text-base max-w-xl mb-8">
              Get notified 15 minutes before rare watches, art, and limited collector lots go live. No spam, strictly upcoming drop alerts.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="w-full max-w-md flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email for drop alerts"
                className="flex-1 px-4 py-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#D6482B] bg-stone-50/50 focus:bg-white transition"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[#D6482B] hover:bg-[#b33a22] text-white shadow-md transition whitespace-nowrap"
              >
                Enable Alerts
              </button>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
