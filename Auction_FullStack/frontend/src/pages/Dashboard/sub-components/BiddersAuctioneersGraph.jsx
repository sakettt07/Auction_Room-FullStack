import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler
);

const BiddersAuctioneersGraph = () => {
  const { totalAuctioneers = [], totalBidders = [] } = useSelector(
    (state) => state.superAdmin
  );

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const biddersData = Array.isArray(totalBidders) && totalBidders.length === 12
    ? totalBidders
    : new Array(12).fill(0);

  const auctioneersData = Array.isArray(totalAuctioneers) && totalAuctioneers.length === 12
    ? totalAuctioneers
    : new Array(12).fill(0);

  const totalBiddersSum = biddersData.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  const totalAuctioneersSum = auctioneersData.reduce((acc, curr) => acc + (Number(curr) || 0), 0);

  const ratio = totalAuctioneersSum > 0
    ? (totalBiddersSum / totalAuctioneersSum).toFixed(1)
    : totalBiddersSum > 0 ? totalBiddersSum : 0;

  // Dynamic max for scale
  const maxBidders = Math.max(...biddersData, 0);
  const maxAuctioneers = Math.max(...auctioneersData, 0);
  const maxCombined = Math.max(maxBidders, maxAuctioneers, 10);
  const suggestedMax = Math.ceil(maxCombined * 1.25);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Registered Bidders",
        data: biddersData,
        borderColor: "#D6482B",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(214, 72, 43, 0.1)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(214, 72, 43, 0.3)");
          gradient.addColorStop(1, "rgba(214, 72, 43, 0.0)");
          return gradient;
        },
        fill: true,
        tension: 0.38,
        pointBackgroundColor: "#D6482B",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#D6482B",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2.5,
      },
      {
        label: "Registered Auctioneers",
        data: auctioneersData,
        borderColor: "#F59E0B",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(245, 158, 11, 0.05)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(245, 158, 11, 0.25)");
          gradient.addColorStop(1, "rgba(245, 158, 11, 0.0)");
          return gradient;
        },
        fill: true,
        tension: 0.38,
        pointBackgroundColor: "#F59E0B",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#F59E0B",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#78716C",
          font: {
            size: 11,
            family: "inherit",
            weight: "600",
          },
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: suggestedMax,
        grid: {
          color: "rgba(231, 229, 228, 0.6)",
          drawBorder: false,
        },
        ticks: {
          stepSize: Math.ceil(suggestedMax / 5),
          color: "#78716C",
          font: {
            size: 11,
            family: "inherit",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Customized in header
      },
      tooltip: {
        backgroundColor: "#1C1917",
        titleColor: "#FFFFFF",
        bodyColor: "#F5F5F4",
        padding: 12,
        cornerRadius: 12,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        titleFont: {
          size: 12,
          weight: "700",
        },
        bodyFont: {
          size: 13,
          weight: "600",
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Top Metrics Summary & Custom Legends */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D6482B]" />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
                Total Bidders
              </span>
              <span className="text-base font-black text-stone-900">
                {totalBiddersSum.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="h-7 w-px bg-stone-200" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
                Total Auctioneers
              </span>
              <span className="text-base font-black text-stone-900">
                {totalAuctioneersSum.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Liquidity Ratio Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200/70 text-xs font-bold text-[#D6482B] self-start sm:self-auto">
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>{ratio}x Liquidity Ratio</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BiddersAuctioneersGraph;
