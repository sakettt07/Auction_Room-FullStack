import {
  clearAllplatformadminSliceErrors,
  getAllPaymentProofs,
  getAllUsers,
  getMonthlyRevenue,
} from "@/store/slices/superAdminSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuctionItemDelete from "./sub-components/AuctionItemDelete";
import BiddersAuctioneersGraph from "./sub-components/BiddersAuctioneersGraph";
import PaymentGraph from "./sub-components/PaymentGraph";
import PaymentProofs from "./sub-components/PaymentProofs";
import Spinner from "@/custom-components/Spinner";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  Cog6ToothIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    loading,
    paymentProofs,
    totalAuctioneers,
    totalBidders,
    monthlyRevenue,
  } = useSelector((state) => state.superAdmin);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  const [stats, setStats] = useState({
    totalProofs: 0,
    pendingProofs: 0,
    approvedProofs: 0,
    rejectedProofs: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    dispatch(getMonthlyRevenue());
    dispatch(getAllUsers());
    dispatch(getAllPaymentProofs());
    dispatch(clearAllplatformadminSliceErrors());
  }, [dispatch]);

  useEffect(() => {
    if (paymentProofs?.length > 0) {
      const pending = paymentProofs.filter(
        (p) => p.status === "Pending",
      ).length;
      const approved = paymentProofs.filter(
        (p) => p.status === "Approved",
      ).length;
      const rejected = paymentProofs.filter(
        (p) => p.status === "Rejected",
      ).length;
      const total = paymentProofs.reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        totalProofs: paymentProofs.length,
        pendingProofs: pending,
        approvedProofs: approved,
        rejectedProofs: rejected,
        totalRevenue: total,
      });
    }
  }, [paymentProofs]);

  useEffect(() => {
    if (user?.role !== "Super Admin" || !isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, user, navigateTo]);

  const quickStats = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Payment Proofs",
      value: stats.totalProofs,
      icon: DocumentCheckIcon,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingProofs,
      icon: BellAlertIcon,
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Total Bidders",
      value: totalBidders?.reduce((sum, val) => sum + val, 0) || 0,
      icon: UserGroupIcon,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Total Auctioneers",
      value: totalAuctioneers?.reduce((sum, val) => sum + val, 0) || 0,
      icon: ChartBarIcon,
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      title: "Approved Proofs",
      value: stats.approvedProofs,
      icon: ArrowTrendingUpIcon,
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
    },
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-full ml-0 m-0 px-4 sm:px-6 pt-20 lg:pl-[320px] pb-10">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#d6482b] to-orange-500 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back, {user?.userName}! Here's what's happening with
                    your platform today.
                  </p>
                </div>
                <div className="hidden lg:flex items-center gap-3">
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#d6482b] to-orange-500 flex items-center justify-center text-white font-semibold">
                      {user?.userName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.userName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      {index === 0 ? "This Month" : "Total"}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.title}</p>
                  <div
                    className={`mt-3 h-1 w-full bg-gradient-to-r ${stat.color} rounded-full opacity-50`}
                  ></div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Monthly Revenue
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Total payments received per month
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-green-50 rounded-full">
                    <span className="text-xs font-medium text-green-600">
                      +12.5% vs last month
                    </span>
                  </div>
                </div>
                <PaymentGraph />
              </div>

              {/* User Growth Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      User Growth
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Bidders vs Auctioneers registration
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#d6482b]"></div>
                      <span className="text-xs text-gray-600">Bidders</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                      <span className="text-xs text-gray-600">Auctioneers</span>
                    </div>
                  </div>
                </div>
                <BiddersAuctioneersGraph />
              </div>
            </div>

            {/* Payment Proofs Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <DocumentCheckIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Payment Proofs
                    </h3>
                    <p className="text-xs text-gray-500">
                      Review and manage payment submissions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span className="text-xs text-gray-600">
                      Pending: {stats.pendingProofs}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="text-xs text-gray-600">
                      Approved: {stats.approvedProofs}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="text-xs text-gray-600">
                      Rejected: {stats.rejectedProofs}
                    </span>
                  </div>
                </div>
              </div>
              <PaymentProofs />
            </div>

            {/* Auction Items Management */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Auction Items Management
                    </h3>
                    <p className="text-xs text-gray-500">
                      Delete inappropriate or expired auction items
                    </p>
                  </div>
                </div>
              </div>
              <AuctionItemDelete />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
