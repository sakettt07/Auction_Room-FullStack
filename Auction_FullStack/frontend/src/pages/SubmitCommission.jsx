import { postCommissionProof } from "@/store/slices/commissionSlice";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CurrencyRupeeIcon,
  PhotoIcon,
  DocumentTextIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const SubmitCommission = () => {
  const [proof, setProof] = useState(null);
  const [preview, setPreview] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [amountError, setAmountError] = useState("");

  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.commission);
  const { user } = useSelector((state) => state.user);

  const unpaidCommission = user?.unpaidCommission || 0;

  const proofHandler = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should not exceed 5MB");
      return;
    }

    setProof(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    proofHandler(file);
  };

  const removeImage = () => {
    setProof(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateAmount = (value) => {
    if (!value) {
      setAmountError("Amount is required");
      return false;
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
      setAmountError("Please enter a valid number");
      return false;
    }

    if (numValue <= 0) {
      setAmountError("Amount must be greater than 0");
      return false;
    }

    if (!Number.isInteger(numValue)) {
      setAmountError("Amount must be a whole number");
      return false;
    }

    if (numValue > unpaidCommission) {
      setAmountError(`Amount cannot exceed ₹${unpaidCommission}`);
      return false;
    }

    setAmountError("");
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    validateAmount(value);
  };

  const handlePaymentProof = async (e) => {
    e.preventDefault();

    if (!validateAmount(amount)) return;

    if (!proof) {
      alert("Please upload a payment screenshot");
      return;
    }

    const formData = new FormData();
    formData.append("proofImage", proof);
    formData.append("amount", parseInt(amount, 10));
    formData.append("comment", comment);

    const res = await dispatch(postCommissionProof(formData));

    if (!res?.error) {
      setAmount("");
      setComment("");
      setProof(null);
      setPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 sm:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#D6482B] to-[#ff6b4a] bg-clip-text text-transparent">
            Upload Commission Proof
          </h1>
          <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base">
            Submit your payment screenshot for verification.
          </p>
        </div>

        {/* Unpaid Commission */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-600">Unpaid Commission</p>
          <p className="text-2xl font-bold text-[#D6482B]">
            ₹{unpaidCommission}
          </p>
        </div>

        {unpaidCommission === 0 && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 text-center">
            You don't have any unpaid commission.
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8">
          <form
            className="flex flex-col gap-6 sm:gap-8"
            onSubmit={handlePaymentProof}
          >
            {/* Amount */}
            <div>
              <label className="flex items-center font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                <CurrencyRupeeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#D6482B]" />
                Amount Paid (₹)
              </label>

              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  onBlur={() => validateAmount(amount)}
                  placeholder="Enter payment amount"
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 ${
                    amountError ? "border-red-500" : "border-gray-200"
                  } rounded-xl focus:border-[#D6482B] focus:bg-white outline-none transition text-sm sm:text-base`}
                  required
                  min="1"
                  step="1"
                />

                {amountError && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <InformationCircleIcon className="w-3 h-3" />
                    {amountError}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Maximum payable amount: ₹{unpaidCommission}
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center font-semibold text-gray-700 mb-3 text-sm sm:text-base">
                <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#D6482B]" />
                Payment Screenshot
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-[#D6482B] rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {preview ? (
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 sm:max-h-80 rounded-lg sm:rounded-xl shadow-lg"
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <PhotoIcon className="w-10 h-10 sm:w-14 sm:h-14 mx-auto text-gray-400 mb-3 sm:mb-4" />
                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                      Click or drag screenshot here
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                      JPG, PNG up to 5MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="flex items-center font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#D6482B]" />
                Comment (Optional)
              </label>

              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add any notes about this payment..."
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#D6482B] focus:bg-white outline-none transition resize-none text-sm sm:text-base"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading ||
                !proof ||
                !amount ||
                amountError ||
                unpaidCommission === 0
              }
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#D6482B] to-[#ff6b4a] text-white font-semibold rounded-xl hover:shadow-lg transition transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
            >
              {loading ? "Uploading..." : "Submit Payment Proof"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitCommission;
