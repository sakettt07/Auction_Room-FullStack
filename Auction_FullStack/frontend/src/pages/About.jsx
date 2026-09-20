import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
  GlobeAltIcon,
  BoltIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  ScaleIcon,
  HeartIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

const About = () => {
  const values = [
    {
      id: 1,
      title: "Uncompromising Integrity",
      description:
        "Every bid, auction hammer, and escrow disbursement is fully auditable. We eliminate shill bidding and hidden buyer premiums.",
      icon: ShieldCheckIcon,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      id: 2,
      title: "Real-Time Engineering",
      description:
        "Engineered with instant WebSocket clock synchronization so bids and countdowns update across global devices in milliseconds.",
      icon: BoltIcon,
      color: "bg-orange-50 text-[#D6482B] border-orange-200",
    },
    {
      id: 3,
      title: "Collector Community",
      description:
        "We unite serious collectors, independent auctioneers, and verified galleries in an exclusive, high-trust digital salon.",
      icon: UserGroupIcon,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: 4,
      title: "Borderless Global Reach",
      description:
        "From multi-currency settlement to insured white-glove logistics, we ensure rare assets cross borders safely and effortlessly.",
      icon: GlobeAltIcon,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ];

  const comparisonPoints = [
    {
      feature: "Platform Commission",
      traditional: "15% to 25% Buyer Premium + Seller Fee",
      auctionSpace: "Flat 8% Fee (0% on first listing)",
    },
    {
      feature: "Payout Speed",
      traditional: "30 to 60 Business Days",
      auctionSpace: "Guaranteed 24-Hour Direct Escrow",
    },
    {
      feature: "Bidding Access",
      traditional: "In-Person Paddles or Phone Lines",
      auctionSpace: "Live Millisecond Digital Synchronization",
    },
    {
      feature: "Item Provenance",
      traditional: "Manual Paper Catalogs",
      auctionSpace: "Verified Digital Documentation & Audits",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50/70 via-white to-stone-50/50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 flex flex-col gap-16 sm:gap-20">
        
        {/* 1. HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase bg-orange-50 text-[#D6482B] border border-orange-200/80 mb-4 shadow-sm">
            <SparklesIcon className="w-4 h-4 text-[#D6482B]" />
            <span>Behind The Platform • Our Vision & Heritage</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight mb-6">
            A Premier Digital Auction Room Built for{" "}
            <span className="bg-gradient-to-r from-[#D6482B] via-orange-600 to-amber-600 bg-clip-text text-transparent">
              Serious Collectors & Sellers.
            </span>
          </h1>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            AuctionSpace was built to replace legacy, opaque auction houses with real-time bidding, certified item provenance, and guaranteed bank-grade escrow protection.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm text-center">
              <p className="text-2xl font-black text-[#D6482B]">100%</p>
              <p className="text-xs font-bold text-stone-600 mt-0.5">Escrow Protected</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm text-center">
              <p className="text-2xl font-black text-stone-900">8%</p>
              <p className="text-xs font-bold text-stone-600 mt-0.5">Transparent Fee</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm text-center">
              <p className="text-2xl font-black text-emerald-600">24 Hours</p>
              <p className="text-xs font-bold text-stone-600 mt-0.5">Fast Settlement</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm text-center">
              <p className="text-2xl font-black text-blue-600">&lt;50ms</p>
              <p className="text-xs font-bold text-stone-600 mt-0.5">Bid Sync Latency</p>
            </div>
          </div>
        </section>

        {/* 2. MISSION & ORIGIN STORY */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-sm flex flex-col justify-between group hover:shadow-md transition">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#D6482B] flex items-center justify-center mb-6">
                <BuildingLibraryIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-stone-900 mb-4">
                Our Mission
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-4">
                Our mission is to bring the electric prestige of in-room auction galas to collectors worldwide with complete transparency, speed, and safety.
              </p>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                We empower buyers to bid with absolute conviction and provide auctioneers the professional digital infrastructure to run high-volume sales seamlessly.
              </p>
            </div>

            <div className="pt-6 border-t border-stone-100 flex items-center gap-2 text-xs font-bold text-[#D6482B]">
              <CheckBadgeIcon className="w-4 h-4" />
              <span>Certified Integrity & Authenticity Protocols</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-sm flex flex-col justify-between group hover:shadow-md transition">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center mb-6">
                <HeartIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-stone-900 mb-4">
                Our Origin Story
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-4">
                AuctionSpace was created with a straightforward conviction: high-value rare items deserve better than clunky, legacy platforms with extortionate buyer premiums.
              </p>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Combining full-stack marketplace architecture with modern UI aesthetics, we built a digital auction house that feels fast, intuitive, and trustworthy from day one.
              </p>
            </div>

            <div className="pt-6 border-t border-stone-100 flex items-center gap-2 text-xs font-bold text-stone-600">
              <SparklesIcon className="w-4 h-4 text-orange-500" />
              <span>Crafted for Collectors, Curators, and Auctioneers</span>
            </div>
          </div>
        </section>

        {/* 3. WHAT WE STAND FOR (4 Core Values) */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#D6482B] border border-orange-200/60 mb-2">
              <ScaleIcon className="w-3.5 h-3.5" />
              Our Principles
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
              What We Stand For
            </h2>
            <p className="text-stone-500 text-sm sm:text-base mt-2">
              The foundational pillars that guide every feature, policy, and transaction on AuctionSpace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${v.color}`}
                  >
                    <v.icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-extrabold text-lg text-stone-900 mb-2 group-hover:text-[#D6482B] transition-colors">
                    {v.title}
                  </h3>

                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. WHY AUCTIONSPACE (Comparison Matrix) */}
        <section className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D6482B] bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60">
                The AuctionSpace Advantage
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
                Traditional Auction Houses vs. AuctionSpace
              </h2>
            </div>

            <div className="rounded-2xl border border-stone-200 overflow-hidden shadow-sm divide-y divide-stone-100">
              <div className="grid grid-cols-3 p-4 bg-stone-50 font-bold text-xs uppercase tracking-wider text-stone-500">
                <span>Standard Pillar</span>
                <span>Legacy Auction Houses</span>
                <span className="text-[#D6482B]">AuctionSpace</span>
              </div>

              {comparisonPoints.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 p-4 text-xs sm:text-sm items-center hover:bg-stone-50/50 transition"
                >
                  <span className="font-bold text-stone-900">{row.feature}</span>
                  <span className="text-stone-500">{row.traditional}</span>
                  <span className="font-extrabold text-[#D6482B] flex items-center gap-1">
                    <CheckBadgeIcon className="w-4 h-4 flex-shrink-0" />
                    {row.auctionSpace}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CALL TO ACTION */}
        <section>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-3">
                <SparklesIcon className="w-3.5 h-3.5" />
                Experience The Difference
              </span>
              <h3 className="text-2xl sm:text-4xl font-black leading-tight mb-2">
                Ready to Join The Premier Auction Marketplace?
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                Discover rare collections, place real-time bids, or list your first high-demand lot with 0% introductory fee.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
              <Link
                to="/auctions"
                className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#D6482B] to-orange-500 hover:from-[#b33a22] text-white shadow-lg transition"
              >
                Browse Auctions
              </Link>
              <Link
                to="/sign-up"
                className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
