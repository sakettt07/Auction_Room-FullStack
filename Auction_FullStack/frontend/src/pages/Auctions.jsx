import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import React from "react";
import { useSelector } from "react-redux";

const Auctions = () => {
  const { allAuctions = [], loading } = useSelector((state) => state.auction);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <article className="w-full px-6 pt-20 lg:pl-[320px] flex flex-col">
          <section className="my-8">
            <h1 className="text-[#d6482b] text-3xl font-bold mb-6 md:text-5xl">
              Auctions
            </h1>

            {allAuctions.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow">
                <img src="/noAuction.png" className="w-40 mb-4 opacity-80" />

                <p className="text-gray-500 text-lg">
                  No auction items available right now
                </p>
              </div>
            ) : (
              <div
                className="grid gap-6 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-4"
              >
                {allAuctions.map((auction) => (
                  <Card
                    key={auction._id}
                    id={auction._id}
                    title={auction.title}
                    startTime={auction.startTime}
                    endTime={auction.endTime}
                    imgSrc={auction.itemImage?.url}
                    startingBid={auction.startingPrice}
                    currentBid={auction.currentPrice}
                    bids={auction.bids}
                  />
                ))}
              </div>
            )}
          </section>
        </article>
      )}
    </>
  );
};

export default Auctions;
