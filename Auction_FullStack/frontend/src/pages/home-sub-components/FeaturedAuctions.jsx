import Card from "@/custom-components/Card";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/custom-components/Spinner";
import { getAllAuctionItems } from "@/store/slices/auctionSlice";
import AuctionCardSkeleton from "@/custom-components/AuctionCardSkeleton";

const FeaturedAuctions = () => {
  const dispatch = useDispatch();
  const { allAuctions = [], loading } = useSelector((state) => state.auction);

  useEffect(() => {
    // ✅ Load cached data instantly
    const cached = localStorage.getItem("auctions_cache");

    if (cached) {
      const parsed = JSON.parse(cached);

      dispatch({
        type: "auction/getAllAuctionItemSuccess",
        payload: parsed.data,
      });
    }

    // ✅ Always fetch fresh data in background
    dispatch(getAllAuctionItems());
  }, [dispatch]);

  return (
    <section className="my-8">
      <h3 className="text-[#111] text-xl font-semibold mb-4 min-[480px]:text-xl md:text-2xl lg:text-3xl">
        Featured Auctions
      </h3>

      {/* ✅ Show loader ONLY if no data exists */}
      {loading && allAuctions.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <AuctionCardSkeleton key={index} />
          ))}
        </div>
      ) : allAuctions.length === 0 ? (
        <div className="w-full py-10 text-center text-gray-500 text-lg">
          No auctions available right now.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {allAuctions.slice(0, 8).map((element) => (
            <Card
              key={element._id}
              id={element._id}
              title={element.title}
              imgSrc={element.itemImage?.url}
              startTime={element.startTime}
              bids={element.bids}
              endTime={element.endTime}
              startingBid={element.startingPrice}
              currentBid={element.currentPrice}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedAuctions;
