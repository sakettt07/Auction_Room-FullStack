import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  TrophyIcon,
  ArrowRightIcon,
  SparklesIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Leaderboard = () => {
  const { leaderboard = [] } = useSelector((state) => state.user);

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs border border-amber-300 shadow-sm">
          🥇
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-300 shadow-sm">
          🥈
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xs border border-orange-300 shadow-sm">
          🥉
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center font-bold text-xs">
        {index + 1}
      </span>
    );
  };

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-50 text-amber-800 border border-yellow-200/60 mb-2">
            <TrophyIcon className="w-3.5 h-3.5 text-amber-600" />
            Hall of Fame
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Top Bidders Leaderboard
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-1">
            Recognizing our highest volume collectors and successful auction winners.
          </p>
        </div>

        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-1 text-sm font-bold text-[#D6482B] hover:text-[#b33a22] transition-colors group"
        >
          <span>View All Rankings</span>
          <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70 text-stone-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Rank & Collector</th>
                <th className="py-4 px-6">Auctions Won</th>
                <th className="py-4 px-6 text-right">Total Expenditure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {(leaderboard || []).slice(0, 6).map((element, index) => {
                return (
                  <tr
                    key={element._id || index}
                    className="hover:bg-orange-50/30 transition-colors"
                  >
                    <td className="py-3.5 px-6 flex items-center gap-3">
                      {getRankBadge(index)}
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                        {element.profileImage?.url ? (
                          <img
                            src={element.profileImage.url}
                            alt={element.userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="w-full h-full text-stone-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 leading-tight">
                          {element.userName}
                        </p>
                        <p className="text-[11px] text-stone-400 font-medium">
                          Verified Bidder
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                        🏆 {element.auctionsWon || 0} won
                      </span>
                    </td>

                    <td className="py-3.5 px-6 text-right font-black text-stone-900 text-base">
                      ₹{Number(element.moneySpent || 0).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-stone-50/80 border-t border-stone-100 text-center">
          <Link
            to="/leaderboard"
            className="text-xs font-bold uppercase tracking-wider text-[#D6482B] hover:text-[#b33a22] transition-colors"
          >
            Explore Complete Top 100 Leaderboard →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
