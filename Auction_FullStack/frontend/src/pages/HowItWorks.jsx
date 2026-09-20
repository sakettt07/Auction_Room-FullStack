import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  ArrowPathIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  RocketLaunchIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const HowItWorks = () => {
  const [activeAudience, setActiveAudience] = useState("bidders"); // 'bidders' | 'auctioneers'
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const bidderSteps = [
    {
      step: "01",
      icon: UserPlusIcon,
      title: "Register & Verify Profile",
      description:
        "Create your free account in 30 seconds. Complete basic verification to unlock live bidding rights across all categories.",
    },
    {
      step: "02",
      icon: MagnifyingGlassIcon,
      title: "Discover Rare & Verified Lots",
      description:
        "Explore curated collections of luxury watches, fine art, memorabilia, and electronics with certified condition reports.",
    },
    {
      step: "03",
      icon: CurrencyDollarIcon,
      title: "Compete with Real-Time Bids",
      description:
        "Place live synchronized bids with one-click quick bid increments (+₹1k, +₹5k). Track countdown timers in real time.",
    },
    {
      step: "04",
      icon: TrophyIcon,
      title: "Win & Settle via Protected Escrow",
      description:
        "Highest bid when timer reaches zero wins. Funds remain safely in escrow until you inspect and verify the delivered item.",
    },
  ];

  const auctioneerSteps = [
    {
      step: "01",
      icon: RocketLaunchIcon,
      title: "Register as an Auctioneer",
      description:
        "Select the Auctioneer role and provide your bank payout credentials for direct deposit upon successful lot delivery.",
    },
    {
      step: "02",
      icon: SparklesIcon,
      title: "List Items with 0% First Fee",
      description:
        "Set your reserve prices, upload high-resolution media, and schedule live or upcoming drop countdown timers.",
    },
    {
      step: "03",
      icon: TrophyIcon,
      title: "Global Bidding Competition",
      description:
        "Reach thousands of verified collectors globally competing for your lots to maximize the final hammer price.",
    },
    {
      step: "04",
      icon: DocumentCheckIcon,
      title: "Instant Verification & Fast Payout",
      description:
        "Upload payment proof for the 8% platform commission. Receive guaranteed 24-hour settlements directly to your bank.",
    },
  ];

  const fullLifecycleSteps = [
    {
      step: "01",
      badge: "Account Setup",
      title: "Create Your Account",
      icon: UserPlusIcon,
      desc: "Sign up as a Bidder or Auctioneer to access live auctions, watchlist management, and your personalized command center.",
    },
    {
      step: "02",
      badge: "Lot Listing",
      title: "List or Discover Lots",
      icon: MagnifyingGlassIcon,
      desc: "Auctioneers publish authenticated items with countdown timers, while buyers explore live drops and schedule reminders.",
    },
    {
      step: "03",
      badge: "Live Competition",
      title: "Real-Time Bidding",
      icon: SparklesIcon,
      desc: "Every bid is tracked with instant millisecond synchronization across all connected collectors worldwide.",
    },
    {
      step: "04",
      badge: "Hammer Drop",
      title: "Win & Receive Confirmation",
      icon: TrophyIcon,
      desc: "When the countdown hits zero, the highest bidder wins instantly and receives secure payment instructions.",
    },
    {
      step: "05",
      badge: "Commission & Escrow",
      title: "Low 8% Fee & Escrow Settlement",
      icon: ShieldCheckIcon,
      desc: "Sellers enjoy 0% introductory fee on their first lot and just 8% thereafter, keeping the marketplace secure and thriving.",
    },
    {
      step: "06",
      badge: "Safety Guarantee",
      title: "Hassle-Free Relisting",
      icon: ArrowPathIcon,
      desc: "If a winning bidder fails to complete payment, auctioneers can relist the lot immediately with a fresh timer.",
    },
  ];

  const faqs = [
    {
      question: "How does the escrow protection work on AuctionSpace?",
      answer:
        "When an auction closes, the buyer's funds are held safely in a secure bank-grade escrow account. Funds are only transferred to the auctioneer after the buyer inspects and confirms receipt of the authenticated lot, preventing counterfeit or non-delivery risks.",
    },
    {
      question: "What is the platform fee for auctioneers?",
      answer:
        "New auctioneers pay a 0% commission fee on their very first listed auction. For subsequent auctions, AuctionSpace charges an industry-low 8% commission only upon successful hammer completion. There are zero listing fees or hidden charges.",
    },
    {
      question: "Are bids placed during auctions legally binding?",
      answer:
        "Yes, all bids placed on AuctionSpace are binding commitments to purchase. Bidders must be authenticated and maintain an active verified profile before entering any live bidding room.",
    },
    {
      question: "How do auctioneers receive their payouts?",
      answer:
        "Auctioneers submit their payment proofs and commission through the dedicated Commission portal. Once verified by platform administrators, net proceeds are transferred directly via bank wire, Stripe, or PayPal within 24 hours.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50/70 via-white to-stone-50/50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 flex flex-col gap-16 sm:gap-20">
        
        {/* 1. HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase bg-orange-50 text-[#D6482B] border border-orange-200/80 mb-4 shadow-sm">
            <SparklesIcon className="w-4 h-4 text-[#D6482B]" />
            <span>Transparent Marketplace • Complete User Guide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight mb-6">
            From First Bid to Hammer Fall,{" "}
            <span className="bg-gradient-to-r from-[#D6482B] via-orange-600 to-amber-600 bg-clip-text text-transparent">
              Every Step is Transparent.
            </span>
          </h1>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Whether you are competing for rare luxury items or liquidating high-value inventory, AuctionSpace delivers an intuitive, fast, and protected experience.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auctions"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] hover:to-orange-600 shadow-md shadow-orange-500/20 hover:shadow-lg transition-all"
            >
              <span>Explore Live Auctions</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/create-auction"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-stone-800 bg-white border border-stone-200 hover:border-[#D6482B] hover:text-[#D6482B] shadow-sm hover:shadow-md transition-all"
            >
              <span>Sell An Item (0% Fee)</span>
              <RocketLaunchIcon className="w-4 h-4 text-[#D6482B]" />
            </Link>
          </div>
        </section>

        {/* 2. DUAL TRACK AUDIENCE SELECTOR (Bidders vs Auctioneers) */}
        <section className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D6482B] mb-1">
              Choose Your Journey
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Tailored Guides for Buyers & Sellers
            </h2>
            
            {/* Toggle Switch */}
            <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-stone-100 border border-stone-200/80">
              <button
                onClick={() => setActiveAudience("bidders")}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeAudience === "bidders"
                    ? "bg-[#D6482B] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <TrophyIcon className="w-4 h-4" />
                <span>For Bidders & Collectors</span>
              </button>
              <button
                onClick={() => setActiveAudience("auctioneers")}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeAudience === "auctioneers"
                    ? "bg-[#D6482B] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <RocketLaunchIcon className="w-4 h-4" />
                <span>For Sellers & Auctioneers</span>
              </button>
            </div>
          </div>

          {/* Steps Grid for Selected Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeAudience === "bidders" ? bidderSteps : auctioneerSteps).map(
              (item, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50/70 rounded-2xl p-6 border border-stone-200/80 hover:border-orange-300 hover:bg-white transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-[#D6482B] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200/60">
                        STEP {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white text-stone-700 flex items-center justify-center shadow-sm border border-stone-200/60 group-hover:bg-[#D6482B] group-hover:text-white transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-stone-900 mb-2 group-hover:text-[#D6482B] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* 3. FULL LIFECYCLE PROGRESSION (6 Milestone Cards) */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#D6482B] border border-orange-200/60 mb-2">
              <CheckCircleIcon className="w-3.5 h-3.5" />
              Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
              The 6 AuctionSpace Milestones
            </h2>
            <p className="text-stone-500 text-sm sm:text-base mt-2">
              Engineered with anti-fraud escrows, millisecond WebSocket sync, and 24-hour settlements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fullLifecycleSteps.map((m, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                      {m.badge}
                    </span>
                    <span className="text-xs font-bold text-[#D6482B]">
                      {m.step} / 06
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#D6482B] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <m.icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-extrabold text-lg text-stone-900 mb-2 group-hover:text-[#D6482B] transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-stone-500 text-sm leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <section className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D6482B] bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-stone-200/80 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full py-4 px-5 text-left font-bold text-sm sm:text-base text-stone-900 flex items-center justify-between gap-4 hover:bg-stone-50 transition"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUpIcon className="w-4 h-4 text-[#D6482B] flex-shrink-0" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CALL TO ACTION */}
        <section>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-3">
                <SparklesIcon className="w-3.5 h-3.5" />
                Instant Access
              </span>
              <h3 className="text-2xl sm:text-4xl font-black leading-tight mb-2">
                Ready to Experience Premium Digital Auctions?
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                Join thousands of verified collectors and sellers worldwide. Transparent rules, zero hidden fees, and bank-grade protection.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
              <Link
                to="/auctions"
                className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] text-white shadow-lg transition"
              >
                Browse Live Lots
              </Link>
              <Link
                to="/create-auction"
                className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
              >
                List First Item
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HowItWorks;
