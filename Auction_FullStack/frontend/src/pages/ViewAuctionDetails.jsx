import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import React, { useEffect } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const ViewAuctionDetails = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction,
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated || user.role === "Bidder") {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated]);

  const auctionStarted = new Date(auctionDetail.startTime) < Date.now();
  const auctionEnded = new Date(auctionDetail.endTime) < Date.now();

  return (
    <section className="w-full px-5 pt-20 lg:pl-[320px]">
      {/* Breadcrumb */}
      <div className="text-[16px] flex flex-wrap gap-2 items-center mb-6">
        <Link to="/" className="font-semibold hover:text-[#D6482B]">
          Home
        </Link>
        <FaGreaterThan className="text-stone-400" />
        <Link
          to="/view-my-auctions"
          className="font-semibold hover:text-[#D6482B]"
        >
          My Auctions
        </Link>
        <FaGreaterThan className="text-stone-400" />
        <p className="text-stone-600">{auctionDetail.title}</p>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid xl:grid-cols-2 gap-8">
          {/* LEFT SECTION */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image */}
              <div className="w-full lg:w-56 h-56 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={auctionDetail.itemImage?.url}
                  alt={auctionDetail.title}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between">
                <h2 className="text-3xl font-bold text-gray-800">
                  {auctionDetail.title}
                </h2>

                <div className="flex gap-3 mt-3 flex-wrap">
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                    {auctionDetail.category}
                  </span>

                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    {auctionDetail.condition}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-lg">
                  <p>
                    <span className="font-semibold">Starting Price:</span>{" "}
                    <span className="text-[#D6482B] font-bold">
                      ₹{auctionDetail.startingPrice}
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold">Current Price:</span>{" "}
                    <span className="text-green-600 font-bold">
                      ₹
                      {auctionDetail.currentPrice ||
                        auctionDetail.startingPrice}
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold">Start Time:</span>{" "}
                    {new Date(auctionDetail.startTime).toLocaleString()}
                  </p>

                  <p>
                    <span className="font-semibold">End Time:</span>{" "}
                    {new Date(auctionDetail.endTime).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3">
                Auction Item Description
              </h3>

              <div className="space-y-2 text-gray-700">
                {auctionDetail.description &&
                  auctionDetail.description
                    .split(". ")
                    .map((text, i) => <li key={i}>{text}</li>)}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - BIDS */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gray-100 px-6 py-4 text-xl font-semibold">
              Bids
            </div>

            <div className="p-6">
              {auctionBidders &&
              auctionBidders.length > 0 &&
              auctionStarted &&
              !auctionEnded ? (
                <div className="space-y-4">
                  {auctionBidders.map((bid, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        index === 0
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={bid.profileImage}
                          alt={bid.userName}
                          className="w-10 h-10 rounded-full"
                        />

                        <p className="font-semibold">{bid.userName}</p>
                      </div>

                      <p className="font-bold text-lg text-gray-700">
                        ₹{bid.bidAmount}
                      </p>

                      <p
                        className={`font-semibold ${
                          index === 0
                            ? "text-green-600"
                            : index === 1
                              ? "text-blue-600"
                              : index === 2
                                ? "text-yellow-600"
                                : "text-gray-500"
                        }`}
                      >
                        #{index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              ) : Date.now() < new Date(auctionDetail.startTime) ? (
                <img
                  src="/notStarted.png"
                  alt="not-started"
                  className="w-full"
                />
              ) : (
                <img src="/auctionEnded.png" alt="ended" className="w-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewAuctionDetails;
