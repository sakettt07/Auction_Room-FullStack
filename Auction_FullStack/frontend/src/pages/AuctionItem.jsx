import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { FaGreaterThan } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MagnifyingGlassPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const AuctionItem = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    auctionDetail,
    auctionBidders = [],
  } = useSelector((state) => state.auction);

  const { isAuthenticated } = useSelector((state) => state.user);

  const [amount, setAmount] = useState("");
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [showFullscreen, setShowFullscreen] = useState(false);

  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const magnifierRef = useRef(null);

  const safeStartingPrice = auctionDetail?.startingPrice || 0;

  const highestBid = useMemo(() => {
    if (Array.isArray(auctionBidders) && auctionBidders.length > 0) {
      return Math.max(...auctionBidders.map((b) => b.bidAmount || 0));
    }
    return safeStartingPrice;
  }, [auctionBidders, safeStartingPrice]);

  const totalBids = Array.isArray(auctionBidders) ? auctionBidders.length : 0;

  const isAuctionRunning =
    auctionDetail?.startTime &&
    auctionDetail?.endTime &&
    Date.now() >= new Date(auctionDetail.startTime) &&
    Date.now() <= new Date(auctionDetail.endTime);

  // Get image dimensions on load
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  }, []);

  // Handle mouse move for magnifier
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !imageRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate cursor position relative to container (percentage)
    const x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const y = ((e.clientY - containerRect.top) / containerRect.height) * 100;

    // Constrain to image bounds (0-100%)
    const constrainedX = Math.min(100, Math.max(0, x));
    const constrainedY = Math.min(100, Math.max(0, y));

    setCursorPosition({
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    });
    setMagnifierPosition({ x: constrainedX, y: constrainedY });
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setShowMagnifier(false);
  }, []);

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    setShowMagnifier(true);
  }, []);

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (showFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showFullscreen]);

  const handleBid = () => {
    if (!amount) return;

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) {
      alert("Please enter a valid bid amount");
      return;
    }

    if (numericAmount <= highestBid) {
      alert("Bid must be higher than the current highest bid");
      return;
    }

    const formData = new FormData();
    formData.append("amount", numericAmount);

    dispatch(placeBid(id, formData));
    dispatch(getAuctionDetail(id));

    setAmount("");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
      return;
    }

    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [dispatch, navigateTo, isAuthenticated, id]);

  return (
    <section className="w-full px-5 pt-24 pb-24 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-[14px] md:text-[16px] flex flex-wrap gap-2 items-center text-slate-600">
        <Link
          to="/"
          className="font-semibold hover:text-[#D6482B] transition-colors"
        >
          Home
        </Link>

        <FaGreaterThan className="text-stone-400 text-xs" />

        <Link
          to="/auctions"
          className="font-semibold hover:text-[#D6482B] transition-colors"
        >
          Auctions
        </Link>

        <FaGreaterThan className="text-stone-400 text-xs" />

        <p className="text-stone-600 line-clamp-1">
          {auctionDetail?.title || "Auction Item"}
        </p>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* TOP SECTION - Fixed Magnifier */}
          <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-100 p-4 md:p-6 flex flex-col lg:flex-row gap-6">
            {/* IMAGE with Magnifier - Fixed */}
            <div className="w-full lg:w-[480px]">
              <div
                ref={containerRef}
                className="relative bg-white shadow-lg rounded-xl overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                style={{ cursor: "none" }}
              >
                {/* Main Image */}
                <img
                  ref={imageRef}
                  src={
                    auctionDetail?.itemImage?.url || "/placeholder-auction.png"
                  }
                  alt={auctionDetail?.title || "Auction item"}
                  className="w-full h-[400px] object-contain"
                  onLoad={handleImageLoad}
                  draggable={false}
                />

                {/* Magnifying Glass Icon - Shows when not hovering */}
                {!showMagnifier && (
                  <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full">
                    <MagnifyingGlassPlusIcon className="w-5 h-5" />
                  </div>
                )}

                {/* Fullscreen Button */}
                <button
                  onClick={() => setShowFullscreen(true)}
                  className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </button>

                {/* Magnifier Lens - Fixed positioning to prevent cutoff */}
                {showMagnifier && (
                  <>
                    {/* Custom cursor indicator */}
                    <div
                      className="absolute w-8 h-8 border-2 border-white rounded-full pointer-events-none"
                      style={{
                        left: cursorPosition.x - 16,
                        top: cursorPosition.y - 16,
                        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                        zIndex: 45,
                      }}
                    />

                    {/* Magnified view - Positioned to stay within viewport */}
                    <div
                      ref={magnifierRef}
                      className="absolute border-4 border-white rounded-lg shadow-2xl pointer-events-none bg-white"
                      style={{
                        width: "200px",
                        height: "200px",
                        // Position to the right if possible, otherwise to the left
                        left:
                          cursorPosition.x + 40 >
                          containerRef.current?.clientWidth - 200
                            ? cursorPosition.x - 240
                            : cursorPosition.x + 40,
                        // Position below if possible, otherwise above
                        top:
                          cursorPosition.y + 40 >
                          containerRef.current?.clientHeight - 200
                            ? cursorPosition.y - 240
                            : cursorPosition.y + 40,
                        backgroundImage: `url(${auctionDetail?.itemImage?.url || "/placeholder-auction.png"})`,
                        backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                        backgroundSize: "800px 800px", // Fixed size for consistent zoom
                        backgroundRepeat: "no-repeat",
                        zIndex: 50,
                      }}
                    >
                      {/* Zoom level indicator */}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        4x
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Helper text */}
              <p className="text-xs text-gray-500 mt-2 text-center">
                Hover over image to zoom • Click fullscreen for detailed view
              </p>
            </div>

            {/* ITEM INFO */}
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {auctionDetail?.title || "Auction item"}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Lot ID:{" "}
                    <span className="font-mono text-[12px] bg-slate-100 px-2 py-1 rounded">
                      {auctionDetail?._id?.slice(-8) || "—"}
                    </span>
                  </p>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-semibold ${
                    isAuctionRunning
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : auctionDetail?.startTime &&
                          new Date(auctionDetail.startTime) > Date.now()
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-slate-200 text-slate-700 border border-slate-300"
                  }`}
                >
                  {isAuctionRunning
                    ? "🟢 Live Now"
                    : auctionDetail?.startTime &&
                        new Date(auctionDetail.startTime) > Date.now()
                      ? "🟡 Upcoming"
                      : "⚫ Auction Ended"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                {auctionDetail?.category && (
                  <span className="bg-gradient-to-r from-[#D6482B]/10 to-orange-500/10 px-4 py-1.5 rounded-full text-[#D6482B] font-medium">
                    {auctionDetail.category}
                  </span>
                )}

                {auctionDetail?.condition && (
                  <span className="bg-slate-100 px-4 py-1.5 rounded-full text-slate-700 font-medium">
                    {auctionDetail.condition}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-700 mt-2">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Starting Price
                  </p>
                  <p className="text-2xl font-bold text-[#D6482B] mt-1">
                    ₹{safeStartingPrice.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Start Time
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    {auctionDetail?.startTime
                      ? new Date(auctionDetail.startTime).toLocaleString(
                          undefined,
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )
                      : "TBD"}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    End Time
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    {auctionDetail?.endTime
                      ? new Date(auctionDetail.endTime).toLocaleString(
                          undefined,
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )
                      : "TBD"}
                  </p>
                </div>
              </div>

              {/* Seller Info */}
              {auctionDetail?.seller && (
                <div className="flex items-center gap-3 mt-2 p-3 bg-slate-50 rounded-xl">
                  <img
                    src={auctionDetail.seller.avatar || "/default-avatar.png"}
                    alt={auctionDetail.seller.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Listed by</p>
                    <p className="font-semibold text-slate-800">
                      {auctionDetail.seller.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CURRENT BID + BID BOX */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-6 items-stretch">
            <div className="bg-white shadow-lg rounded-2xl border border-slate-100 p-6 flex justify-between items-center">
              <div>
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
                  Current Highest Bid
                </p>

                <h2 className="text-4xl font-bold bg-gradient-to-r from-[#D6482B] to-orange-500 bg-clip-text text-transparent mt-1">
                  ₹{highestBid.toLocaleString()}
                </h2>
              </div>

              <div className="text-right">
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
                  Total Bids
                </p>
                <p className="text-3xl font-bold text-slate-700">{totalBids}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#D6482B] to-orange-500 rounded-2xl p-6 flex flex-col gap-3 justify-between shadow-xl">
              {isAuctionRunning ? (
                <>
                  <div>
                    <p className="text-xs text-white/80 uppercase tracking-[0.2em] font-semibold">
                      place your bid
                    </p>
                    <p className="text-sm text-white/90 mt-1">
                      Minimum bid:{" "}
                      <span className="font-bold">
                        ₹{(highestBid + 1).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <input
                      type="number"
                      className="flex-1 px-4 py-3 rounded-xl outline-none text-sm bg-white/95 focus:bg-white transition-all duration-300"
                      placeholder={`Min ₹${highestBid + 1}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min={highestBid + 1}
                    />

                    <button
                      onClick={handleBid}
                      className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <RiAuctionFill className="text-lg" />
                      Place Bid
                    </button>
                  </div>
                </>
              ) : auctionDetail?.startTime &&
                new Date(auctionDetail.startTime) > Date.now() ? (
                <div className="text-center py-4">
                  <p className="text-white text-lg font-semibold">
                    ⏳ Auction starts in{" "}
                    {Math.ceil(
                      (new Date(auctionDetail.startTime) - Date.now()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white text-lg font-semibold">
                    🏁 This auction has ended
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* DESCRIPTION + BIDDERS */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-6 items-start">
            {/* DESCRIPTION */}
            <div className="bg-white shadow-lg rounded-2xl border border-slate-100 p-6">
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                Item Description
              </h3>

              {auctionDetail?.description ? (
                <div className="prose prose-sm max-w-none">
                  <ul className="list-disc ml-5 text-sm md:text-base text-gray-700 space-y-2">
                    {auctionDetail.description
                      .split(". ")
                      .filter(Boolean)
                      .map((element, index) => (
                        <li key={index} className="leading-relaxed">
                          {element}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No additional description provided for this item.
                </p>
              )}
            </div>

            {/* BIDDERS */}
            <div className="bg-white shadow-lg rounded-2xl border border-slate-100 p-6">
              <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                <span>Top Bidders</span>
                {totalBids > 0 && (
                  <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {totalBids} {totalBids === 1 ? "bid" : "bids"}
                  </span>
                )}
              </h3>

              {auctionBidders?.length > 0 ? (
                <div className="space-y-3">
                  {auctionBidders.map((bid, index) => (
                    <div
                      key={bid._id || index}
                      className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-slate-50 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={bid.profileImage || "/placeholder-profile.png"}
                            alt={bid.userName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                          />
                          {index === 0 && (
                            <span className="absolute -top-1 -right-1 text-yellow-500">
                              👑
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-sm">
                            {bid.userName || "Anonymous"}
                          </p>
                          <p className="text-sm font-bold text-[#D6482B]">
                            ₹{bid.bidAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`font-bold text-sm ${
                          index === 0
                            ? "text-yellow-600"
                            : index === 1
                              ? "text-gray-500"
                              : index === 2
                                ? "text-orange-600"
                                : "text-slate-400"
                        }`}
                      >
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 italic">
                    No bids placed yet
                  </p>
                  {isAuctionRunning && (
                    <p className="text-xs text-gray-400 mt-2">
                      Be the first to bid!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Fullscreen Image Modal - Simplified for single image */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>

          {/* Main Image */}
          <div className="max-w-7xl max-h-[90vh] p-8">
            <img
              src={auctionDetail?.itemImage?.url || "/placeholder-auction.png"}
              alt={auctionDetail?.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Image Info */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {auctionDetail?.title}
          </div>
        </div>
      )}
    </section>
  );
};

export default AuctionItem;
