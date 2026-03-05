import React from "react";
import { RiAuctionFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UpcomingAuctions = () => {
  const { allAuctions = [] } = useSelector((state) => state.auction);

  const today = new Date().toDateString();

  const auctionsStartingToday = allAuctions.filter((item) => {
    return new Date(item.startTime).toDateString() === today;
  });

  return (
    <section className="my-10">
      {/* Section Title */}
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Auctions For Today
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Highlight Card */}
        <div className="bg-[#161613] text-white rounded-xl p-6 flex flex-col justify-between shadow-lg">
          <span className="bg-[#fdba88] w-fit p-3 rounded-full">
            <RiAuctionFill size={22} />
          </span>

          <div>
            <h3 className="text-[#fdba88] text-xl font-semibold">
              Auctions For
            </h3>
            <h2 className="text-3xl font-bold">Today</h2>
          </div>

          <p className="text-gray-300 text-sm">
            Explore auctions that are starting today and place your bids.
          </p>
        </div>

        {/* Auction Cards */}
        {auctionsStartingToday.slice(0, 6).map((auction) => (
          <Link
            to={`/auction/item/${auction._id}`}
            key={auction._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="h-36 bg-gray-100 overflow-hidden">
              <img
                src={auction.itemImage?.url}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-3">
              <h4 className="font-semibold text-gray-800 line-clamp-2">
                {auction.title}
              </h4>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Starting Bid</span>
                <span className="text-[#fdba88] font-semibold">
                  ₹{auction.startingPrice}
                </span>
              </div>

              <div className="text-sm">
                <p className="text-gray-500">Start Time</p>
                <p className="font-medium text-gray-700">
                  {new Date(auction.startTime).toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {auctionsStartingToday.length === 0 && (
        <p className="text-gray-500 mt-6">No auctions starting today.</p>
      )}
    </section>
  );
};

export default UpcomingAuctions;
