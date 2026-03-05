import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Card = ({
  imgSrc,
  title,
  startingBid,
  currentBid,
  startTime,
  endTime,
  id,
  bids,
}) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const startDiff = new Date(startTime) - now;
    const endDiff = new Date(endTime) - now;

    if (startDiff > 0) {
      return {
        type: "Starts In",
        time: startDiff,
      };
    }

    if (endDiff > 0) {
      return {
        type: "Ends In",
        time: endDiff,
      };
    }

    return { type: "Ended", time: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);

    const pad = (n) => String(n).padStart(2, "0");

    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const now = new Date();

  const status =
    now < new Date(startTime)
      ? "Upcoming"
      : now > new Date(endTime)
        ? "Ended"
        : "Live";

  const statusColor =
    status === "Live"
      ? "bg-green-500"
      : status === "Upcoming"
        ? "bg-blue-500"
        : "bg-gray-500";

  const highestBid = bids?.length
    ? Math.max(...bids.map((b) => b.bidAmount))
    : startingBid;

  return (
    <Link
      to={`/auction/item/${id}`}
      className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group"
    >
      <div className="relative">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-44 object-cover group-hover:scale-105 transition"
        />

        <span
          className={`absolute top-3 left-3 text-white text-xs px-3 py-1 rounded ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-[#d6482b]">
          {title}
        </h3>

        <p className="text-sm text-gray-500">Starting Bid</p>

        <p className="text-lg font-bold text-[#d6482b]">₹{startingBid}</p>

        <p className="text-sm text-gray-500">Current Bid</p>

        <p className="font-semibold">₹{currentBid}</p>

        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{timeLeft.type}</span>

          <span className="font-semibold">
            {timeLeft.type !== "Ended"
              ? formatTime(timeLeft.time)
              : "Auction Finished"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Card;
