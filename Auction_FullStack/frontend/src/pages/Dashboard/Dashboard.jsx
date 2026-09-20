import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  clearAllplatformadminSliceErrors,
  getAllPaymentProofs,
  getAllUsers,
  getMonthlyRevenue,
} from "@/store/slices/superAdminSlice";
import { getAllAuctionItems } from "@/store/slices/auctionSlice";
import Spinner from "@/custom-components/Spinner";
import PaymentGraph from "./sub-components/PaymentGraph";
import BiddersAuctioneersGraph from "./sub-components/BiddersAuctioneersGraph";
import PaymentProofs from "./sub-components/PaymentProofs";
import AuctionItemDelete from "./sub-components/AuctionItemDelete";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

import {
  CurrencyRupeeIcon,
  DocumentCheckIcon,
  BellAlertIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowPathIcon,
  Squares2X2Icon,
  TrashIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const {
    loading,
    paymentProofs = [],
    totalAuctioneers = [],
    totalBidders = [],
    monthlyRevenue = [],
  } = useSelector((state) => state.superAdmin);
  const { allAuctions = [] } = useSelector((state) => state.auction);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'settlements', 'moderation'
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Authentication & Super Admin protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/login");
      return;
    }
    if (user && user.role !== "Super Admin") {
      navigateTo("/");
    }
  }, [isAuthenticated, user, navigateTo]);

  // Fetch all admin data on mount
  useEffect(() => {
    dispatch(getMonthlyRevenue());
    dispatch(getAllUsers());
    dispatch(getAllPaymentProofs());
    dispatch(getAllAuctionItems());
    dispatch(clearAllplatformadminSliceErrors());
  }, [dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      dispatch(getMonthlyRevenue()),
      dispatch(getAllUsers()),
      dispatch(getAllPaymentProofs()),
      dispatch(getAllAuctionItems()),
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Compute Platform Executive KPI metrics
  const stats = useMemo(() => {
    const pending = paymentProofs.filter((p) => p.status === "Pending").length;
    const approved = paymentProofs.filter((p) => p.status === "Approved").length;
    const rejected = paymentProofs.filter((p) => p.status === "Rejected").length;
    const settled = paymentProofs.filter((p) => p.status === "Settled").length;

    const totalRevenue = paymentProofs
      .filter((p) => p.status === "Approved" || p.status === "Settled")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const totalBiddersCount = Array.isArray(totalBidders)
      ? totalBidders.reduce((sum, val) => sum + (Number(val) || 0), 0)
      : 0;

    const totalAuctioneersCount = Array.isArray(totalAuctioneers)
      ? totalAuctioneers.reduce((sum, val) => sum + (Number(val) || 0), 0)
      : 0;

    const totalProcessed = approved + rejected + settled;
    const clearanceRate =
      totalProcessed > 0
        ? Math.round(((approved + settled) / totalProcessed) * 100)
        : 100;

    return {
      totalProofs: paymentProofs.length,
      pendingProofs: pending,
      approvedProofs: approved + settled,
      rejectedProofs: rejected,
      totalRevenue,
      totalBidders: totalBiddersCount,
      totalAuctioneers: totalAuctioneersCount,
      totalAuctionsCount: allAuctions.length,
      clearanceRate,
    };
  }, [paymentProofs, totalBidders, totalAuctioneers, allAuctions]);

  // Doughnut Chart Data for Settlement Proofs
  const doughnutData = {
    labels: ["Approved", "Pending Audit", "Rejected"],
    datasets: [
      {
        data: [
          stats.approvedProofs || 1,
          stats.pendingProofs || 0,
          stats.rejectedProofs || 0,
        ],
        backgroundColor: ["#10B981", "#F59E0B", "#F43F5E"],
        borderColor: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 11,
            weight: "600",
            family: "inherit",
          },
          padding: 16,
          color: "#78716C",
        },
      },
      tooltip: {
        backgroundColor: "#1C1917",
        titleColor: "#FFFFFF",
        bodyColor: "#F5F5F4",
        padding: 10,
        cornerRadius: 10,
      },
    },
    cutout: "74%",
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 pt-6 sm:pt-8 pb-20 selection:bg-[#D6482B]/10 selection:text-[#D6482B]">
      {/* AMBIENT BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#D6482B]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            1. SUPER ADMIN MASTER CONSOLE HEADER
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#D6482B] border border-orange-200/60 mb-2.5">
              <SparklesIcon className="w-3.5 h-3.5" />
              Super Admin Master Command Center
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              Platform{" "}
              <span className="bg-gradient-to-r from-[#D6482B] via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-stone-500 text-sm sm:text-base mt-1.5 max-w-2xl">
              Welcome back, {user?.userName || "Admin"}. Supervise real-time platform revenue trajectories, verify settlement vouchers, and curate the live catalog.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 hover:border-stone-300 transition shadow-sm disabled:opacity-50 cursor-pointer"
              title="Refresh all metrics"
            >
              <ArrowPathIcon
                className={`w-4 h-4 text-stone-500 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. EXECUTIVE KPI INTELLIGENCE ROW
           ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 my-8">
          {/* Revenue */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-4 sm:p-5 border border-stone-800 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Gross Settled
              </span>
              <CurrencyRupeeIcon className="w-4 h-4 text-[#D6482B]" />
            </div>
            <div className="my-2">
              <p className="text-xl sm:text-2xl font-black text-white truncate">
                ₹{Number(stats.totalRevenue).toLocaleString("en-IN")}
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-3 h-3" />
              <span>Verified Ledger</span>
            </span>
          </div>

          {/* Pending Audits */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-amber-200 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Pending Audits
              </span>
              {stats.pendingProofs > 0 ? (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              ) : (
                <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className="my-2">
              <p className="text-2xl font-black text-amber-900">
                {stats.pendingProofs}
              </p>
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              Vouchers awaiting review
            </span>
          </div>

          {/* Clearance Rate */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Audit Clearance
              </span>
              <CheckBadgeIcon className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2">
              <p className="text-2xl font-black text-stone-900">
                {stats.clearanceRate}%
              </p>
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              Approval resolution rate
            </span>
          </div>

          {/* Total Bidders */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-blue-200 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Total Bidders
              </span>
              <UserGroupIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="my-2">
              <p className="text-2xl font-black text-stone-900">
                {stats.totalBidders}
              </p>
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              Registered patron base
            </span>
          </div>

          {/* Total Auctioneers */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-orange-200 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Auctioneers
              </span>
              <ChartBarIcon className="w-4 h-4 text-[#D6482B]" />
            </div>
            <div className="my-2">
              <p className="text-2xl font-black text-stone-900">
                {stats.totalAuctioneers}
              </p>
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              Verified catalogers
            </span>
          </div>

          {/* Catalog Lots */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-purple-200 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Live Catalog
              </span>
              <SparklesIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div className="my-2">
              <p className="text-2xl font-black text-stone-900">
                {stats.totalAuctionsCount}
              </p>
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              Total lots listed
            </span>
          </div>
        </div>

        {/* =========================================================================
            3. WORKSPACE TABS SELECTOR
           ========================================================================= */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            <Squares2X2Icon className="w-4 h-4" />
            <span>Analytics & Intelligence</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settlements")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === "settlements"
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            <DocumentCheckIcon className="w-4 h-4" />
            <span>Settlement Proofs</span>
            {stats.pendingProofs > 0 && (
              <span className="px-2 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {stats.pendingProofs}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("moderation")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === "moderation"
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            <TrashIcon className="w-4 h-4" />
            <span>Catalog Moderation</span>
            <span className="px-2 py-0.2 rounded-full text-[10px] bg-stone-100 text-stone-600 font-bold">
              {stats.totalAuctionsCount}
            </span>
          </button>
        </div>

        {/* =========================================================================
            4. TAB CONTENTS
           ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Visualizations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 8 Cols: Revenue & User Growth Charts */}
              <div className="lg:col-span-8 space-y-8">
                {/* Revenue Trajectory Chart */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-stone-900">
                        Monthly Revenue Trajectory
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Verified commission proceeds credited to platform accounts
                      </p>
                    </div>
                  </div>
                  <PaymentGraph />
                </div>

                {/* User Growth Chart */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-stone-900">
                        Collector & Partner Cohort Expansion
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Monthly registration momentum comparing Bidders vs Auctioneers
                      </p>
                    </div>
                  </div>
                  <BiddersAuctioneersGraph />
                </div>
              </div>

              {/* Right 4 Cols: Doughnut Distribution & Fast Actions */}
              <div className="lg:col-span-4 space-y-8">
                {/* Settlement Distribution Doughnut */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      Voucher Audit Distribution
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Proportion of approved, pending, and rejected settlements
                    </p>
                  </div>

                  <div className="relative h-56 w-full flex items-center justify-center">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-7">
                      <span className="text-xs uppercase font-bold text-stone-400">
                        Audited
                      </span>
                      <span className="text-2xl font-black text-stone-900">
                        {stats.totalProofs}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>Audit Resolution Status:</span>
                    <span className="font-bold text-emerald-600">
                      {stats.clearanceRate}% Cleared
                    </span>
                  </div>
                </div>

                {/* Security & System Protocol Card */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                    <ShieldCheckIcon className="w-5 h-5 text-[#D6482B]" />
                    <h4>Super Admin Integrity Shield</h4>
                  </div>

                  <div className="space-y-3 text-xs text-stone-500 leading-relaxed">
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                      <p className="font-bold text-stone-800">
                        Fiduciary Escrow Protection
                      </p>
                      <p className="mt-0.5 text-stone-500">
                        Platform holds funds in isolated custody until delivery confirmations are cryptographically signed.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                      <p className="font-bold text-stone-800">
                        Auto-Commission Recalculation
                      </p>
                      <p className="mt-0.5 text-stone-500">
                        Approving proof vouchers automatically credits user ledger balances in real time.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("settlements")}
                    className="w-full py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-sm"
                  >
                    Open Audit Console →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Settlement Proofs */}
        {activeTab === "settlements" && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm animate-in fade-in duration-200 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Remittance Proofs Audit Console
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Inspect bank transfer receipts, adjust verified settlement sums, and credit auctioneer ledgers.
              </p>
            </div>
            <PaymentProofs />
          </div>
        )}

        {/* Tab 3: Catalog Moderation */}
        {activeTab === "moderation" && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm animate-in fade-in duration-200 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Platform Catalog & Lot Moderation
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Inspect active or scheduled lots, monitor valuations, and purge inappropriate catalogue listings.
              </p>
            </div>
            <AuctionItemDelete />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
