import Card from "@/custom-components/Card";
import React from "react";
import { useSelector } from "react-redux";
import Spinner from "@/custom-components/Spinner";

const FeaturedAuctions = () => {
  const { allAuctions = [], loading } = useSelector((state) => state.auction);

  console.log("These are my features auction-----", allAuctions);

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="my-8">
      <h3 className="text-[#111] text-xl font-semibold mb-4 min-[480px]:text-xl md:text-2xl lg:text-3xl">
        Featured Auctions
      </h3>

      {allAuctions.length === 0 ? (
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
