import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuredRef = useRef(null);
  const upcomingRef = useRef(null);
  const leaderboardRef = useRef(null);
  const ctaRef = useRef(null);
  const heroImageRef = useRef(null);

  const howItWorks = [
    {
      title: "Post Items",
      description: "Auctioneers list premium items for global bidding.",
      icon: RocketLaunchIcon,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Place Bids",
      description: "Users compete with real-time bids in a transparent system.",
      icon: ArrowTrendingUpIcon,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Win Auctions",
      description: "Highest bidder wins instantly once the timer ends.",
      icon: TrophyIcon,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Secure Payments",
      description: "Built-in payment and verification system.",
      icon: ShieldCheckIcon,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const sidebarCards = [
    {
      title: "0% Platform Fee",
      text: "New sellers pay zero platform fee on their first auction.",
      icon: CurrencyDollarIcon,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Daily Live Auctions",
      text: "Hundreds of trending items auctioned every day.",
      icon: ClockIcon,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Verified Sellers",
      text: "All sellers go through platform verification.",
      icon: ShieldCheckIcon,
      gradient: "from-purple-500 to-violet-500",
    },
    {
      title: "Secure Payments",
      text: "Transparent bidding with trusted payment gateways.",
      icon: CurrencyDollarIcon,
      gradient: "from-green-500 to-teal-500",
    },
    {
      title: "Fast Payouts",
      text: "Auctioneers receive payouts quickly after auction completion.",
      icon: RocketLaunchIcon,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { value: "12+", label: "Active Bidders", icon: UserGroupIcon },
    { value: "40+", label: "Auctions Completed", icon: TrophyIcon },
    { value: "₹3Lk+", label: "Total Value Traded", icon: CurrencyDollarIcon },
    { value: "98%", label: "Successful Auctions", icon: SparklesIcon },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
      });

      gsap.from(statsRef.current?.children, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 85%",
        },
      });

      gsap.from(howItWorksRef.current?.children, {
        opacity: 0,
        scale: 0.9,
        stagger: 0.15,
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: "top 85%",
        },
      });

      gsap.from(featuredRef.current, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: featuredRef.current,
          start: "top 85%",
        },
      });

      gsap.from(upcomingRef.current, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: upcomingRef.current,
          start: "top 85%",
        },
      });

      gsap.from(leaderboardRef.current, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: leaderboardRef.current,
          start: "top 85%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12">
        {/* SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24 h-fit">
          {sidebarCards.map((card, index) => (
            <div
              key={index}
              className="group relative rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient}`}
                >
                  <card.icon className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h4 className="font-semibold text-lg text-gray-800">
                    {card.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{card.text}</p>
                </div>
              </div>
            </div>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex flex-col gap-20">
          {/* HERO */}
          <div ref={heroRef} className="relative max-w-5xl">
            <p className="inline-block text-sm uppercase tracking-[0.3em] text-[#d6482b] font-semibold mb-6 bg-[#d6482b]/5 px-4 py-2 rounded-full">
              ✨ Transparent Digital Auctions
            </p>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-slate-900">
              Discover Rare
              <span className="text-[#d6482b]"> Items.</span>
              <br />
              Compete in Live
              <span className="text-blue-600"> Auctions.</span>
            </h1>

            <p className="text-gray-600 text-lg mt-6 max-w-2xl">
              Join thousands of collectors and bidders worldwide. Experience
              transparent auctions powered by real-time bidding technology.
            </p>

            {!isAuthenticated && (
              <div className="flex flex-wrap gap-4 mt-10">
                <Link
                  to="/sign-up"
                  className="bg-gradient-to-r from-[#d6482b] to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition flex items-center"
                >
                  Get Started
                  <ChevronRightIcon className="w-5 h-5 ml-2" />
                </Link>

                <Link
                  to="/login"
                  className="border-2 border-[#d6482b] text-[#d6482b] px-8 py-4 rounded-xl font-semibold hover:bg-[#d6482b] hover:text-white transition"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
          <div ref={featuredRef}>
            <FeaturedAuctions />
          </div>

          {/* STATS */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-[#d6482b]" />
                </div>

                <h3 className="text-4xl font-bold text-[#d6482b]">
                  {stat.value}
                </h3>

                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* HOW IT WORKS */}
          <div ref={howItWorksRef} className="flex flex-col gap-8">
            <h3 className="text-4xl font-bold text-slate-900">How It Works</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg p-8"
                >
                  <item.icon className="w-8 h-8 text-[#d6482b] mb-4" />

                  <h4 className="font-bold text-xl mb-3">{item.title}</h4>

                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div ref={upcomingRef}>
            <UpcomingAuctions />
          </div>

          <div ref={leaderboardRef}>
            <Leaderboard />
          </div>

          {/* CTA */}
          <div
            ref={ctaRef}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-center text-white"
          >
            <h3 className="text-4xl font-bold mb-6">
              Trusted by Auctioneers Worldwide
            </h3>

            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Thousands of collectors trust our platform to buy rare
              collectibles and luxury items through transparent auctions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
