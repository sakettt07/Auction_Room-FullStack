import { postCommissionProof } from "@/store/slices/commissionSlice";
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CurrencyRupeeIcon,
  PhotoIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const SubmitCommission = () => {
  const [proof, setProof] = useState(null);
  const [preview, setPreview] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");

  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.commission);

  const proofHandler = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
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

  const handlePaymentProof = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("proof", proof);
    formData.append("amount", amount);
    formData.append("comment", comment);

    dispatch(postCommissionProof(formData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#D6482B] to-[#ff6b4a] bg-clip-text text-transparent">
            Upload Commission Proof
          </h1>

          <p className="text-gray-500 mt-3">
            Submit your payment screenshot for verification.
          </p>
        </div>

        {/* Card */}

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form className="flex flex-col gap-8" onSubmit={handlePaymentProof}>
            {/* Amount */}

            <div>
              <label className="flex items-center font-semibold text-gray-700 mb-2">
                <CurrencyRupeeIcon className="w-5 h-5 mr-2 text-[#D6482B]" />
                Amount Paid
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter payment amount"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#D6482B] focus:bg-white outline-none transition"
                required
              />
            </div>

            {/* Proof Upload */}

            <div>
              <label className="flex items-center font-semibold text-gray-700 mb-3">
                <PhotoIcon className="w-5 h-5 mr-2 text-[#D6482B]" />
                Payment Screenshot
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-[#D6482B] rounded-2xl p-10 text-center cursor-pointer transition"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {preview ? (
                  <div className="relative flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-80 rounded-xl shadow-lg"
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <PhotoIcon className="w-14 h-14 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">
                      Click or drag screenshot here
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      JPG, PNG up to 5MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Comment */}

            <div>
              <label className="flex items-center font-semibold text-gray-700 mb-2">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-[#D6482B]" />
                Comment (Optional)
              </label>

              <textarea
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add any notes about this payment..."
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#D6482B] focus:bg-white outline-none transition resize-none"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#D6482B] to-[#ff6b4a] text-white font-semibold rounded-xl hover:shadow-xl transition transform hover:scale-[1.02] disabled:opacity-50"
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
