import {
  deletePaymentProof,
  getSinglePaymentProofDetail,
  updatePaymentProof,
} from "@/store/slices/superAdminSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  EyeIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const PaymentProofs = () => {
  const { paymentProofs, singlePaymentProof } = useSelector(
    (state) => state.superAdmin,
  );

  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const dispatch = useDispatch();

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = () => {
    dispatch(deletePaymentProof(deleteModal.id));
    setDeleteModal({ isOpen: false, id: null });
  };

  const handleFetchDetail = (id) => {
    dispatch(getSinglePaymentProofDetail(id));
  };

  useEffect(() => {
    if (singlePaymentProof && Object.keys(singlePaymentProof).length > 0) {
      setOpenDrawer(true);
    }
  }, [singlePaymentProof]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Settled":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircleIcon className="w-4 h-4" />;
      case "Rejected":
        return <XCircleIcon className="w-4 h-4" />;
      case "Pending":
        return <ClockIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredProofs = paymentProofs?.filter((proof) => {
    const matchesSearch =
      proof.userId?.userName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      proof.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || proof.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d6482b] focus:border-transparent outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d6482b] focus:border-transparent outline-none text-sm bg-white"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Settled">Settled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProofs?.length > 0 ? (
              filteredProofs.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {item.userId?.profileImage ? (
                          <img
                            src={item.userId.profileImage}
                            alt={item.userId.userName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {item.userId?.userName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {item.userId?.userName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">
                      {item.userId?.email}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-green-600">
                      ₹{item.amount?.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                    >
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">
                      {new Date(item.uploadedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        onClick={() => handleFetchDetail(item._id)}
                        title="Review Proof"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        onClick={() => handleDelete(item._id)}
                        title="Delete Proof"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <DocumentTextIcon className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">
                      No payment proofs found
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-[#d6482b] text-sm hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Drawer */}
      <Drawer setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <TrashIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Payment Proof
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this payment proof? This action
              cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteModal({ isOpen: false, id: null })}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentProofs;

// Enhanced Drawer Component
export const Drawer = ({ setOpenDrawer, openDrawer }) => {
  const { singlePaymentProof, loading } = useSelector(
    (state) => state.superAdmin,
  );

  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");

  const dispatch = useDispatch();

  useEffect(() => {
    if (singlePaymentProof) {
      setAmount(singlePaymentProof.amount || "");
      setStatus(singlePaymentProof.status || "Pending");
    }
  }, [singlePaymentProof]);

  const handleUpdate = () => {
    if (!amount || !status) {
      alert("Amount and status required");
      return;
    }
    dispatch(updatePaymentProof(singlePaymentProof._id, status, amount));
  };

  if (!singlePaymentProof) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/60 transition-all duration-300 z-50 ${
        openDrawer ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={() => setOpenDrawer(false)}
    >
      <div
        className={`absolute bottom-0 left-0 w-full bg-white rounded-t-2xl transform transition-transform duration-300 ${
          openDrawer ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#D6482B]">
              Review Payment Proof
            </h3>
            <button
              onClick={() => setOpenDrawer(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Details */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  User Name
                </label>
                <p className="text-lg font-semibold">
                  {singlePaymentProof.userId?.userName}
                </p>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  Email
                </label>
                <p className="text-lg">{singlePaymentProof.userId?.email}</p>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  Comment
                </label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {singlePaymentProof.comment || "No comment provided"}
                </p>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d6482b] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d6482b] focus:border-transparent outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approve Payment</option>
                  <option value="Rejected">Reject Payment</option>
                  <option value="Settled">Mark as Settled</option>
                </select>
              </div>
            </div>

            {/* Right Column - Image */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                Payment Proof Image
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <img
                  src={singlePaymentProof.proofImage?.url}
                  alt="payment proof"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Payment Proof"}
            </button>
            <button
              onClick={() => setOpenDrawer(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
