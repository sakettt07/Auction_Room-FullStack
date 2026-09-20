import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePaymentProof,
  getSinglePaymentProofDetail,
  updatePaymentProof,
  getAllPaymentProofs,
} from "@/store/slices/superAdminSlice";
import { toast } from "react-toastify";
import {
  EyeIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowTopRightOnSquareIcon,
  CurrencyRupeeIcon,
  UserIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const PaymentProofs = () => {
  const dispatch = useDispatch();
  const { paymentProofs = [], singlePaymentProof } = useSelector(
    (state) => state.superAdmin
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Review Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    amount: "",
    status: "Pending",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    userName: "",
    amount: 0,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Image Zoom Modal State
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleFetchDetail = (id) => {
    dispatch(getSinglePaymentProofDetail(id));
  };

  useEffect(() => {
    if (singlePaymentProof && Object.keys(singlePaymentProof).length > 0) {
      setReviewForm({
        amount: singlePaymentProof.amount || "",
        status: singlePaymentProof.status || "Pending",
      });
      setIsReviewOpen(true);
    }
  }, [singlePaymentProof]);

  const handleUpdate = async (overrideStatus = null) => {
    const finalStatus = overrideStatus || reviewForm.status;
    if (!reviewForm.amount || !finalStatus) {
      toast.error("Both verified amount and status are required");
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(
        updatePaymentProof(
          singlePaymentProof._id,
          finalStatus,
          reviewForm.amount
        )
      );
      setIsReviewOpen(false);
      dispatch(getAllPaymentProofs());
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      await dispatch(deletePaymentProof(deleteModal.id));
      setDeleteModal({ isOpen: false, id: null, userName: "", amount: 0 });
      dispatch(getAllPaymentProofs());
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircleIcon className="w-3.5 h-3.5" />
            <span>Approved</span>
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
            <XCircleIcon className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      case "Settled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
            <CheckBadgeIcon className="w-3.5 h-3.5" />
            <span>Settled</span>
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
            <ClockIcon className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const filteredProofs = paymentProofs.filter((proof) => {
    const name = proof.userId?.userName?.toLowerCase() || "";
    const email = proof.userId?.email?.toLowerCase() || "";
    const query = searchTerm.toLowerCase();
    const matchesSearch = name.includes(query) || email.includes(query);
    const matchesStatus = statusFilter === "All" || proof.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: paymentProofs.length,
    pending: paymentProofs.filter((p) => p.status === "Pending").length,
    approved: paymentProofs.filter((p) => p.status === "Approved").length,
    rejected: paymentProofs.filter((p) => p.status === "Rejected").length,
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search & Status Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by auctioneer name or email..."
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

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "All", label: "All Proofs", count: counts.all },
            { id: "Pending", label: "Pending", count: counts.pending, dot: "bg-amber-500" },
            { id: "Approved", label: "Approved", count: counts.approved, dot: "bg-emerald-500" },
            { id: "Rejected", label: "Rejected", count: counts.rejected, dot: "bg-rose-500" },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/80"
                }`}
              >
                {tab.dot && <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Proofs Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200/80 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4 sm:px-6">Auctioneer</th>
              <th className="py-3 px-4">Remitted Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Receipt Voucher</th>
              <th className="py-3 px-4">Date Submitted</th>
              <th className="py-3 px-4 text-right pr-6">Review & Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredProofs.length > 0 ? (
              filteredProofs.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-stone-50/70 transition-colors group"
                >
                  {/* Auctioneer Identity */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#D6482B] flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                        {item.userId?.userName?.charAt(0) || "A"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-stone-900 truncate">
                          {item.userId?.userName || "Unknown Patron"}
                        </p>
                        <p className="text-[11px] text-stone-400 truncate">
                          {item.userId?.email || "No email on record"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-black text-stone-900 text-sm">
                      ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Voucher Thumbnail */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {item.proofImage?.url ? (
                      <button
                        type="button"
                        onClick={() => setZoomedImage(item.proofImage.url)}
                        className="group/img relative inline-block rounded-xl overflow-hidden border border-stone-200 hover:border-[#D6482B] transition cursor-pointer"
                        title="Click to view voucher"
                      >
                        <img
                          src={item.proofImage.url}
                          alt="Voucher"
                          className="w-10 h-10 object-cover group-hover/img:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <EyeIcon className="w-4 h-4 text-white" />
                        </div>
                      </button>
                    ) : (
                      <span className="text-[11px] text-stone-400 italic">No receipt attached</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 text-[11px]">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recent"}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleFetchDetail(item._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-orange-50 hover:text-[#D6482B] text-stone-700 text-xs font-bold transition cursor-pointer"
                        title="Audit & Approve"
                      >
                        <EyeIcon className="w-3.5 h-3.5 text-stone-500" />
                        <span>Audit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            id: item._id,
                            userName: item.userId?.userName || "Auctioneer",
                            amount: item.amount || 0,
                          })
                        }
                        className="p-1.5 rounded-xl bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-600 transition cursor-pointer"
                        title="Delete voucher entry"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-stone-400 text-xs">
                  No payment proofs match your active filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          REVIEW & AUDIT MODAL
         ========================================================================= */}
      {isReviewOpen && singlePaymentProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-orange-100 text-[#D6482B] flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Audit Settlement Voucher
                  </h3>
                  <p className="text-xs text-stone-500">
                    Inspect proof image, verify wire credentials, and update ledger status
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center transition cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* User Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                    Auctioneer Name
                  </span>
                  <span className="font-bold text-stone-900">
                    {singlePaymentProof.userId?.userName || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                    Contact Email
                  </span>
                  <span className="font-medium text-stone-700 truncate block">
                    {singlePaymentProof.userId?.email || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                    Submitted Date
                  </span>
                  <span className="font-medium text-stone-700">
                    {singlePaymentProof.createdAt
                      ? new Date(singlePaymentProof.createdAt).toLocaleDateString("en-IN")
                      : "Recent"}
                  </span>
                </div>
              </div>

              {/* Receipt Image Inspection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Payment Voucher Receipt
                </label>
                {singlePaymentProof.proofImage?.url ? (
                  <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 max-h-72 flex items-center justify-center group">
                    <img
                      src={singlePaymentProof.proofImage.url}
                      alt="Receipt Voucher"
                      className="max-h-72 object-contain w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setZoomedImage(singlePaymentProof.proofImage.url)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-stone-900/80 text-white text-xs font-bold backdrop-blur-md hover:bg-stone-900 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                      <span>Zoom Receipt</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-400">
                    No receipt image attached to this record.
                  </div>
                )}
              </div>

              {/* Auctioneer Remarks */}
              {singlePaymentProof.comment && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs">
                  <span className="font-bold text-amber-900 block mb-0.5">
                    Auctioneer Settlement Remarks:
                  </span>
                  <p className="text-amber-800 leading-relaxed">
                    "{singlePaymentProof.comment}"
                  </p>
                </div>
              )}

              {/* Audit Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Verified Amount (INR ₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={reviewForm.amount}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, amount: e.target.value })
                      }
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Ledger Status
                  </label>
                  <select
                    value={reviewForm.status}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, status: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D6482B]/20 focus:border-[#D6482B] transition cursor-pointer"
                  >
                    <option value="Pending">Pending Audit</option>
                    <option value="Approved">Approved (Credit Ledger)</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Settled">Settled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 bg-stone-50/50">
              <button
                type="button"
                onClick={() => handleUpdate("Rejected")}
                disabled={isUpdating}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
              >
                Reject Voucher
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate("Approved")}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D6482B] hover:bg-[#b83b22] text-white text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : "Approve & Credit Ledger"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          IMAGE ZOOM LIGHTBOX MODAL
         ========================================================================= */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={zoomedImage}
              alt="Zoomed Receipt"
              className="max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION DIALOG
         ========================================================================= */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <ExclamationTriangleIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Delete Settlement Record?
                </h3>
                <p className="text-xs text-stone-500">
                  This payment voucher record will be permanently purged.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 my-4 text-xs">
              <p className="font-bold text-stone-900">{deleteModal.userName}</p>
              <p className="text-stone-500 mt-0.5">
                Amount: ₹{Number(deleteModal.amount).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() =>
                  setDeleteModal({ isOpen: false, id: null, userName: "", amount: 0 })
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
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Purge Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProofs;
