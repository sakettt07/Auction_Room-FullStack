import { deleteAuctionItem } from "@/store/slices/superAdminSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const AuctionItemDelete = () => {
  const { allAuctions = [] } = useSelector((state) => state.auction);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    title: "",
  });

  const dispatch = useDispatch();

  const handleAuctionDelete = (id) => {
    dispatch(deleteAuctionItem(id));
    setDeleteModal({ isOpen: false, id: null, title: "" });
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: null, title: "" });
  };

  const filteredAuctions = allAuctions.filter((auction) =>
    auction.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search auction items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d6482b] focus:border-transparent outline-none text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAuctions.length > 0 ? (
              filteredAuctions.map((element) => (
                <tr
                  key={element._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={element.itemImage?.url || "/placeholder-image.jpg"}
                      alt={element.title}
                      className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {element.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ID: {element._id.slice(-6)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                      {element.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-600">
                      ₹
                      {element.currentPrice?.toLocaleString() ||
                        element.startingPrice?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/auction/details/${element._id}`}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        onClick={() =>
                          openDeleteModal(element._id, element.title)
                        }
                        title="Delete Auction"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src="/no-data.svg"
                      alt="No auctions"
                      className="w-24 h-24 mb-3 opacity-50"
                    />
                    <p className="text-gray-500 text-sm">
                      No auction items found
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-[#d6482b] text-sm hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Auction Item
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete "{deleteModal.title}"? This action
              cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleAuctionDelete(deleteModal.id)}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default AuctionItemDelete;
