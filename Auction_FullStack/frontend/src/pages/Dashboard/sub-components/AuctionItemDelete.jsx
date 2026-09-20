import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAuctionItem } from "@/store/slices/superAdminSlice";
import { getAllAuctionItems } from "@/store/slices/auctionSlice";
import {
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  TagIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const AuctionItemDelete = () => {
  const dispatch = useDispatch();
  const { allAuctions = [] } = useSelector((state) => state.auction);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    title: "",
    imageUrl: "",
    price: 0,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    allAuctions.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ["All", ...Array.from(set)];
  }, [allAuctions]);

  const filteredAuctions = useMemo(() => {
    return allAuctions.filter((auction) => {
      const matchesSearch =
        auction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || auction.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allAuctions, searchTerm, selectedCategory]);

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteAuctionItem(deleteModal.id));
      setDeleteModal({ isOpen: false, id: null, title: "", imageUrl: "", price: 0 });
      dispatch(getAllAuctionItems());
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search catalog lot by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition placeholder:text-stone-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-stone-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Catalog Lots Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200/80 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4 sm:px-6">Lot Item</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Current Price</th>
              <th className="py-3 px-4">Timeline</th>
              <th className="py-3 px-4 text-right pr-6">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredAuctions.length > 0 ? (
              filteredAuctions.map((element) => (
                <tr
                  key={element._id}
                  className="hover:bg-stone-50/70 transition-colors group"
                >
                  {/* Thumbnail & Title */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={element.itemImage?.url || "/placeholder_image.jpg"}
                        alt={element.title}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-stone-900 truncate group-hover:text-[#D6482B] transition-colors">
                          {element.title}
                        </p>
                        <span className="text-[10px] text-stone-400 font-mono">
                          ID: {element._id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category & Condition */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-orange-50 text-[#D6482B] border border-orange-200/60">
                      {element.category || "Uncategorized"}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-black text-stone-900 text-sm">
                      ₹
                      {Number(
                        element.currentPrice || element.startingPrice || 0
                      ).toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-stone-400">
                      Reserve: ₹
                      {Number(element.startingPrice || 0).toLocaleString("en-IN")}
                    </p>
                  </td>

                  {/* Timeline */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-stone-500">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        {element.endTime
                          ? new Date(element.endTime).toLocaleDateString("en-IN")
                          : "Scheduled"}
                      </span>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/auction/item/${element._id}`}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                        title="View live room"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            id: element._id,
                            title: element.title,
                            imageUrl: element.itemImage?.url || "",
                            price: element.currentPrice || element.startingPrice || 0,
                          })
                        }
                        className="p-2 rounded-xl bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-600 transition cursor-pointer"
                        title="Delete from catalogue"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-stone-400 text-xs">
                  No auction lots match your moderation search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <ExclamationTriangleIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Purge Auction Listing?
                </h3>
                <p className="text-xs text-stone-500">
                  This auction and all associated bid history will be permanently deleted.
                </p>
              </div>
            </div>

            {/* Thumbnail Preview */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 my-4 flex items-center gap-3 text-xs">
              <img
                src={deleteModal.imageUrl || "/placeholder_image.jpg"}
                alt={deleteModal.title}
                className="w-12 h-12 rounded-xl object-cover border border-stone-200"
              />
              <div className="min-w-0">
                <p className="font-bold text-stone-900 truncate">{deleteModal.title}</p>
                <p className="text-stone-400 mt-0.5">
                  Valuation: ₹{Number(deleteModal.price).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Are you sure you want to delete this listing from the platform? This action cannot be reverted.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-100 mt-4">
              <button
                type="button"
                onClick={() =>
                  setDeleteModal({ isOpen: false, id: null, title: "", imageUrl: "", price: 0 })
                }
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Purging..." : "Yes, Purge Listing"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionItemDelete;
