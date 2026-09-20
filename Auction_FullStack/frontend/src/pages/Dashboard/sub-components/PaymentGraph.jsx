import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  ArrowTrendingUpIcon,
  SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler
);

const PaymentGraph = () => {
  const { monthlyRevenue = [] } = useSelector((state) => state.superAdmin);
  const [chartType, setChartType] = useState("area"); // 'area' or 'bar'

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

  // Calculate statistics
  const dataPoints = Array.isArray(monthlyRevenue) && monthlyRevenue.length === 12
    ? monthlyRevenue
    : new Array(12).fill(0);

  const totalYTD = dataPoints.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  const maxRevenue = Math.max(...dataPoints, 0);
  const peakMonthIndex = dataPoints.indexOf(maxRevenue);
  const peakMonthName = peakMonthIndex !== -1 ? months[peakMonthIndex] : "N/A";
  const activeMonths = dataPoints.filter((v) => v > 0).length || 1;
  const avgMonthly = Math.round(totalYTD / activeMonths);

  // Dynamic max for scale
  const suggestedMax = Math.max(Math.ceil(maxRevenue * 1.2), 5000);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Platform Revenue",
        data: dataPoints,
        borderColor: "#D6482B",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(214, 72, 43, 0.2)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          if (chartType === "area") {
            gradient.addColorStop(0, "rgba(214, 72, 43, 0.45)");
            gradient.addColorStop(0.65, "rgba(214, 72, 43, 0.12)");
            gradient.addColorStop(1, "rgba(214, 72, 43, 0.0)");
          } else {
            gradient.addColorStop(0, "#D6482B");
            gradient.addColorStop(1, "#F97316");
          }
          return gradient;
        },
        fill: chartType === "area",
        tension: 0.38,
        pointBackgroundColor: "#D6482B",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: chartType === "area" ? 4 : 0,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#D6482B",
        pointHoverBorderColor: "#FFFFFF",
        pointHoverBorderWidth: 3,
        borderRadius: chartType === "bar" ? 8 : 0,
        borderWidth: chartType === "area" ? 3 : 0,
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
          color: "#78716C",
          font: {
            size: 11,
            family: "inherit",
          },
          callback: function (value) {
            if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
            if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
            return `₹${value}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
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
        callbacks: {
          label: function (context) {
            const val = context.parsed.y || 0;
            return `  Collected Revenue: ₹${val.toLocaleString("en-IN")}`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Top Metrics Summary & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
              YTD Gross Volume
            </span>
            <span className="text-lg font-black text-stone-900">
              ₹{totalYTD.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="h-7 w-px bg-stone-200" />
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
              Peak Month ({peakMonthName})
            </span>
            <span className="text-sm font-bold text-[#D6482B]">
              ₹{maxRevenue.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="h-7 w-px bg-stone-200 hidden sm:block" />
          <div className="hidden sm:block">
            <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
              Monthly Avg
            </span>
            <span className="text-sm font-bold text-stone-700">
              ₹{avgMonthly.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType("area")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
              chartType === "area"
                ? "bg-white text-[#D6482B] shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Spline Area
          </button>
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
              chartType === "bar"
                ? "bg-white text-[#D6482B] shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Volume Bars
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {chartType === "area" ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default PaymentGraph;
