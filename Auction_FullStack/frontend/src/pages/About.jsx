import React from "react";
import { FaUsers, FaShieldAlt, FaBolt, FaGlobe } from "react-icons/fa";

const About = () => {
  const values = [
    {
      id: 1,
      title: "Integrity",
      description:
        "We prioritise honesty and transparency so that every bid, win, and payout feels fair and trustworthy.",
      icon: <FaShieldAlt />,
    },
    {
      id: 2,
      title: "Innovation",
      description:
        "We continuously refine AuctionSpace with modern UX, analytics, and automation to keep auctions fast and intuitive.",
      icon: <FaBolt />,
    },
    {
      id: 3,
      title: "Community",
      description:
        "We connect passionate buyers and serious auctioneers, creating a marketplace where premium items find the right owners.",
      icon: <FaUsers />,
    },
    {
      id: 4,
      title: "Global mindset",
      description:
        "We design for a borderless world—from payment methods to time zones—so great auctions can happen anywhere.",
      icon: <FaGlobe />,
    },
  ];

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-10 gap-12">
        {/* Hero */}
        <div className="w-full">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#d6482b]/80 mb-3">
            about AuctionSpace
          </p>
          <h1 className="text-3xl md:text-5xl xl:text-6xl font-bold text-slate-900 mb-4">
            A premium auction room
            <span className="text-[#d6482b]">
              {" "}
              built for serious buyers and sellers.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl">
            AuctionSpace is where transparent rules, curated listings, and
            modern technology come together to create a marketplace you can
            trust and enjoy every single day.
          </p>
        </div>

        {/* Mission + Story */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Our mission
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Our mission is to make online auctions feel as thrilling and
              reliable as a premium in-room experience. We give bidders the
              confidence to go all in, and auctioneers the tools to run
              professional-grade events from anywhere.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Our story
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              AuctionSpace was crafted by CodeWithZeeshu with a simple belief:
              great items and serious buyers deserve better than clunky legacy
              auction tools. With experience across web engineering and
              marketplace design, we built AuctionSpace to feel fast, elegant,
              and trustworthy from day one.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="space-y-5">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
            What we stand for
          </h3>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.id}
                className="bg-white/90 rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#d6482b]/10 text-[#d6482b] flex items-center justify-center">
                    {value.icon}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {value.title}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Join section */}
        <div className="mt-4 md:mt-8 rounded-2xl border border-dashed border-[#d6482b]/40 bg-[#fff7f2] px-5 py-4 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-2xl font-semibold text-slate-900 mb-1">
              Join the AuctionSpace marketplace
            </h3>
            <p className="text-sm md:text-base text-slate-600 max-w-xl">
              Whether you&rsquo;re listing your first item or chasing your next
              collection piece, AuctionSpace is designed to feel premium, fast,
              and fair at every click.
            </p>
          </div>
          <p className="text-sm md:text-base font-semibold text-[#d6482b]">
            Thank you for choosing AuctionSpace. We&rsquo;re excited to be part
            of your auction journey.
          </p>
        </div>
      </section>
    </>
  );
};

export default About;
