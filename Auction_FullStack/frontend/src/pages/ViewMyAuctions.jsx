import CardTwo from "@/custom-components/CardTwo";
import Spinner from "@/custom-components/Spinner";
import { getMyAuctionItems } from "@/store/slices/auctionSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  TrophyIcon,
  RectangleStackIcon,
  FireIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const ViewMyAuctions = () => {
  const { myAuctions = [], loading } = useSelector((state) => state.auction);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [cachedAuctions, setCachedAuctions] = useState([]);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    ended: 0,
    upcoming: 0,
    totalBids: 0,
    totalRevenue: 0,
    soldItems: 0,
  });
  useEffect(() => {
    const cached = localStorage.getItem("my_auctions_cache");

    if (cached) {
      const parsed = JSON.parse(cached);
      const isValid = Date.now() - parsed.time < 5 * 60 * 1000;

      if (isValid) {
        setCachedAuctions(parsed.data);
      }
    }
  }, []);
  const displayAuctions = myAuctions.length > 0 ? myAuctions : cachedAuctions;

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Auctioneer") {
      navigateTo("/");
      return;
    }
    dispatch(getMyAuctionItems());
  }, [dispatch, navigateTo, isAuthenticated, user]);

  useEffect(() => {
    if (displayAuctions.length > 0) {
      const now = new Date();
      const active = displayAuctions.filter(
        (a) => new Date(a.startTime) <= now && new Date(a.endTime) > now,
      ).length;
      const ended = displayAuctions.filter(
        (a) => new Date(a.endTime) <= now,
      ).length;
      const upcoming = displayAuctions.filter(
        (a) => new Date(a.startTime) > now,
      ).length;

      const totalBids = displayAuctions.reduce(
        (sum, auction) => sum + (auction.bids?.length || 0),
        0,
      );

      const totalRevenue = displayAuctions
        .filter((a) => new Date(a.endTime) <= now && a.currentPrice)
        .reduce((sum, auction) => sum + (auction.currentPrice || 0), 0);

      const soldItems = displayAuctions.filter(
        (a) => new Date(a.endTime) <= now && a.bids?.length > 0,
      ).length;

      setStats({
        total: displayAuctions.length,
        active,
        ended,
        upcoming,
        totalBids,
        totalRevenue,
        soldItems,
      });
    }
  }, [displayAuctions]);

  const filteredAuctions = displayAuctions.filter((auction) => {
    const now = new Date();
    switch (selectedFilter) {
      case "active":
        return (
          new Date(auction.startTime) <= now && new Date(auction.endTime) > now
        );
      case "ended":
        return new Date(auction.endTime) <= now;
      case "upcoming":
        return new Date(auction.startTime) > now;
      case "sold":
        return new Date(auction.endTime) <= now && auction.bids?.length > 0;
      case "unsold":
        return (
          new Date(auction.endTime) <= now &&
          (!auction.bids || auction.bids.length === 0)
        );
      default:
        return true;
    }
  });

  const filterOptions = [
    {
      id: "all",
      label: "All Auctions",
      icon: RectangleStackIcon,
      count: stats.total,
      color: "blue",
    },
    {
      id: "active",
      label: "Live Now",
      icon: FireIcon,
      count: stats.active,
      color: "green",
    },
    {
      id: "upcoming",
      label: "Upcoming",
      icon: CalendarIcon,
      count: stats.upcoming,
      color: "yellow",
    },
    {
      id: "ended",
      label: "Ended",
      icon: CheckCircleIcon,
      count: stats.ended,
      color: "gray",
    },
    {
      id: "sold",
      label: "Sold",
      icon: TrophyIcon,
      count: stats.soldItems,
      color: "purple",
    },
    {
      id: "unsold",
      label: "Unsold",
      icon: XCircleIcon,
      count: stats.ended - stats.soldItems,
      color: "red",
    },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-[#d6482b] text-white p-4 rounded-full shadow-lg hover:bg-[#b33a22] transition-colors flex items-center justify-center"
        >
          <FunnelIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={closeSidebar}
        />
      )}

      {/* Left Sidebar - Monitoring Tabs */}
      <div
        className={`fixed left-0 top-0 lg:top-24 h-full lg:h-[calc(100vh-6rem)] w-72 bg-white shadow-xl transition-transform duration-300 z-50 lg:z-30 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-700">Monitoring</h2>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Filter Options */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setSelectedFilter(filter.id);
                closeSidebar();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                selectedFilter === filter.id
                  ? `bg-${filter.color}-50 text-${filter.color}-600`
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <filter.icon
                className={`w-5 h-5 flex-shrink-0 ${
                  selectedFilter === filter.id
                    ? `text-${filter.color}-500`
                    : "text-gray-400"
                }`}
              />

              <span className="flex-1 text-sm font-medium text-left">
                {filter.label}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  selectedFilter === filter.id
                    ? `bg-${filter.color}-100 text-${filter.color}-600`
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Stats in Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-[#d6482b]">
                ₹{stats.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Bids</span>
              <span className="font-semibold text-gray-700">
                {stats.totalBids}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sold Items</span>
              <span className="font-semibold text-green-600">
                {stats.soldItems}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-72 p-4 sm:p-6 pt-20 lg:pt-24">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#d6482b] to-orange-500 bg-clip-text text-transparent">
            My Auctions
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Monitor and manage your auction listings
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-blue-500">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-green-500">
            <p className="text-xs text-gray-500">Live</p>
            <p className="text-lg font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-yellow-500">
            <p className="text-xs text-gray-500">Upcoming</p>
            <p className="text-lg font-bold text-yellow-600">
              {stats.upcoming}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-gray-500">
            <p className="text-xs text-gray-500">Ended</p>
            <p className="text-lg font-bold text-gray-600">{stats.ended}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-purple-500">
            <p className="text-xs text-gray-500">Sold</p>
            <p className="text-lg font-bold text-purple-600">
              {stats.soldItems}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-[#d6482b]">
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-sm font-bold text-[#d6482b] truncate">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Mobile Filter Tabs */}
        <div className="lg:hidden overflow-x-auto pb-2 mb-4">
          <div className="flex gap-2 min-w-max">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === filter.id
                    ? `bg-${filter.color}-500 text-white shadow-md`
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <filter.icon className="w-3.5 h-3.5" />
                <span>{filter.label}</span>
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                    selectedFilter === filter.id
                      ? "bg-white bg-opacity-20"
                      : "bg-gray-100"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Indicator */}
        {selectedFilter !== "all" && (
          <div className="flex items-center gap-2 mb-4 text-sm bg-white p-3 rounded-lg shadow-sm">
            <span className="text-gray-600">Showing:</span>
            <span className="px-3 py-1 bg-[#d6482b] text-white rounded-full text-xs font-medium">
              {filterOptions.find((f) => f.id === selectedFilter)?.label}
            </span>
            <button
              onClick={() => setSelectedFilter("all")}
              className="text-gray-500 hover:text-[#d6482b] text-xs ml-auto"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Auctions Grid */}
        {loading && displayAuctions.length === 0 ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <>
            {filteredAuctions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
                {filteredAuctions.map((element) => (
                  <CardTwo
                    key={element._id}
                    id={element._id}
                    title={element.title}
                    startingBid={element.startingPrice}
                    currentPrice={element.currentPrice}
                    endTime={element.endTime}
                    startTime={element.startTime}
                    imgSrc={element.itemImage?.url}
                    bids={element.bids || []}
                    highestBidder={element.highestBidder}
                    createdAt={element.createdAt}
                    category={element.category}
                    condition={element.condition}
                    compact={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <RectangleStackIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No auctions found
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {selectedFilter === "all"
                    ? "You haven't created any auctions yet"
                    : `No ${filterOptions.find((f) => f.id === selectedFilter)?.label.toLowerCase()} available`}
                </p>
                <button
                  onClick={() => navigateTo("/create-auction")}
                  className="bg-[#d6482b] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#b33a22] transition-colors shadow-md hover:shadow-lg"
                >
                  Create New Auction
                </button>
              </div>
            )}
          </>
        )}

        {/* Results Count */}
        {filteredAuctions.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {filteredAuctions.length} of {displayAuctions.length}{" "}
            auctions
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMyAuctions;
