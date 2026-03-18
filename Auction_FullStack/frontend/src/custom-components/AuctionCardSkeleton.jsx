import React from "react";

const AuctionCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 animate-pulse">
      {/* Image */}
      <div className="w-full h-40 bg-gray-200 rounded-md mb-3"></div>

      {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

      {/* Bid */}
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>

      {/* Time */}
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>

      {/* Button */}
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

export default AuctionCardSkeleton;
