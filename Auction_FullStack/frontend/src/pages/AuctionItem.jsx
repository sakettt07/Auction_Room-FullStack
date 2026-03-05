import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import React, { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const AuctionItem = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction,
  );

  const { isAuthenticated } = useSelector((state) => state.user);

  const [amount, setAmount] = useState("");

  // Highest bid
  const highestBid =
    auctionBidders && auctionBidders.length > 0
      ? Math.max(...auctionBidders.map((b) => b.bidAmount))
      : auctionDetail.startingPrice;

  const totalBids = auctionBidders ? auctionBidders.length : 0;

  const isAuctionRunning =
    Date.now() >= new Date(auctionDetail.startTime) &&
    Date.now() <= new Date(auctionDetail.endTime);

  const handleBid = () => {
    if (!amount) return;

    if (amount <= highestBid) {
      alert("Bid must be higher than the current highest bid");
      return;
    }

    const formData = new FormData();
    formData.append("amount", amount);

    dispatch(placeBid(id, formData));
    dispatch(getAuctionDetail(id));

    setAmount("");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }

    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated, id]);

  // Auto refresh auction
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     dispatch(getAuctionDetail(id));
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [id]);

  return (
    <section className="w-full px-5 pt-20 lg:pl-[320px] flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="text-[16px] flex flex-wrap gap-2 items-center">
        <Link to="/" className="font-semibold hover:text-[#D6482B]">
          Home
        </Link>

        <FaGreaterThan className="text-stone-400" />

        <Link to="/auctions" className="font-semibold hover:text-[#D6482B]">
          Auctions
        </Link>

        <FaGreaterThan className="text-stone-400" />

        <p className="text-stone-600">{auctionDetail.title}</p>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* TOP SECTION */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* IMAGE */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex items-center justify-center w-full lg:w-[420px]">
              <img
                src={auctionDetail.itemImage?.url}
                alt={auctionDetail.title}
                className="max-h-[320px] object-contain"
              />
            </div>

            {/* ITEM INFO */}
            <div className="flex flex-col gap-4 flex-1">
              <h1 className="text-3xl font-bold text-gray-800">
                {auctionDetail.title}
              </h1>

              <div className="flex gap-4 flex-wrap text-lg">
                <span className="bg-gray-100 px-3 py-1 rounded">
                  Category: <b>{auctionDetail.category}</b>
                </span>

                <span className="bg-gray-100 px-3 py-1 rounded">
                  Condition: <b>{auctionDetail.condition}</b>
                </span>
              </div>

              <div className="flex flex-col gap-2 text-gray-600">
                <p>
                  Starting Price:
                  <span className="font-semibold text-black ml-2">
                    ₹{auctionDetail.startingPrice}
                  </span>
                </p>

                <p>
                  Start Time:
                  <span className="ml-2">
                    {new Date(auctionDetail.startTime).toLocaleString()}
                  </span>
                </p>

                <p>
                  End Time:
                  <span className="ml-2">
                    {new Date(auctionDetail.endTime).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* CURRENT BID CARD */}
          <div className="bg-white shadow-xl rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Current Highest Bid</p>

              <h2 className="text-3xl font-bold text-[#D6482B]">
                ₹{highestBid}
              </h2>
            </div>

            <div className="text-right">
              <p className="text-gray-500 text-sm">Total Bids</p>
              <p className="text-xl font-semibold">{totalBids}</p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Item Description</h3>

            <ul className="list-disc ml-6 text-gray-700">
              {auctionDetail.description &&
                auctionDetail.description
                  .split(". ")
                  .map((element, index) => <li key={index}>{element}</li>)}
            </ul>
          </div>

          {/* BIDDERS */}
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Top Bidders</h3>

            {auctionBidders?.length > 0 ? (
              auctionBidders.map((bid, index) => (
                <div
                  key={bid._id}
                  className="flex items-center justify-between py-3 border-b"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={bid.profileImage}
                      alt={bid.userName}
                      className="w-10 h-10 rounded-full"
                    />

                    <div>
                      <p className="font-semibold">{bid.userName}</p>
                      <p className="text-sm text-gray-500">₹{bid.bidAmount}</p>
                    </div>
                  </div>

                  <div className="font-semibold text-lg">#{index + 1}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No bids yet</p>
            )}
          </div>

          {/* BID SECTION */}
          <div className="bg-[#D6482B] rounded-xl p-5 flex items-center justify-between">
            {isAuctionRunning ? (
              <>
                <div className="flex gap-3 items-center">
                  <p className="text-white font-semibold">Your Bid</p>

                  <input
                    type="number"
                    className="px-3 py-2 rounded outline-none"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleBid}
                  className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <RiAuctionFill />
                  Place Bid
                </button>
              </>
            ) : new Date(auctionDetail.startTime) > Date.now() ? (
              <p className="text-white text-xl font-semibold">
                Auction has not started yet
              </p>
            ) : (
              <p className="text-white text-xl font-semibold">
                Auction has ended
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default AuctionItem;
