import React from "react";
import {
  FaUser,
  FaGavel,
  FaEnvelope,
  FaDollarSign,
  FaFileInvoice,
  FaRedo,
} from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUser />,
      title: "Create your account",
      badge: "Step 01",
      description:
        "Sign up as a bidder or auctioneer in a few clicks to unlock bidding, listing, and dashboard features.",
    },
    {
      icon: <FaGavel />,
      title: "List or discover items",
      badge: "Step 02",
      description:
        "Auctioneers publish premium items with rich details and timers, while bidders explore live and upcoming auctions.",
    },
    {
      icon: <FaEnvelope />,
      title: "Win & get notified",
      badge: "Step 03",
      description:
        "When the timer ends, the highest bidder instantly receives an email with secure payment instructions.",
    },
    {
      icon: <FaDollarSign />,
      title: "Secure payments & fees",
      badge: "Step 04",
      description:
        "Bidders pay the auctioneer directly. Auctioneers then pay a 5% commission to keep the marketplace thriving.",
    },
    {
      icon: <FaFileInvoice />,
      title: "Upload proof & verify",
      badge: "Step 05",
      description:
        "Auctioneers upload payment proofs. Admins verify screenshots and amounts, automatically adjusting unpaid commission.",
    },
    {
      icon: <FaRedo />,
      title: "Republish unsold items",
      badge: "Step 06",
      description:
        "If a winner doesn’t pay, the auctioneer can effortlessly relist the item with fresh timing and visibility.",
    },
  ];

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-10 gap-10">
        {/* Hero */}
        <div className="w-full">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#d6482b]/80 mb-3">
            how AuctionSpace works
          </p>
          <h1 className="text-3xl md:text-5xl xl:text-6xl font-bold text-slate-900 mb-4">
            From listing to winning,
            <span className="text-[#d6482b]"> every step is designed</span> to
            be transparent.
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl">
            Whether you are a first-time bidder or a power auctioneer,
            AuctionSpace guides you through a clear, secure, and rewarding
            auction journey.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col gap-4 overflow-hidden"
            >
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d6482b] via-amber-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-[#d6482b]/10 text-[#d6482b] flex items-center justify-center text-xl group-hover:bg-[#d6482b] group-hover:text-white transition-colors duration-300">
                    {step.icon}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {step.badge}
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {index + 1} / {steps.length}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 group-hover:text-[#d6482b] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="mt-4 md:mt-8 rounded-2xl border border-dashed border-[#d6482b]/40 bg-[#fff7f2] px-5 py-4 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-2xl font-semibold text-slate-900 mb-1">
              Ready to experience premium auctions?
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-xl">
              Start by creating your account, explore live auctions, or list
              your first item in minutes.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
