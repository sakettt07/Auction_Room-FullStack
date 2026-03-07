import { createAuction } from "@/store/slices/auctionSlice";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import {
  CameraIcon,
  XMarkIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  TagIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const CreateAuction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { loading } = useSelector((state) => state.auction);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    startingBid: "",
  });

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [errors, setErrors] = useState({});

  const auctionCategories = [
    "Electronics",
    "Furniture",
    "Art & Antiques",
    "Jewelry & Watches",
    "Automobiles",
    "Real Estate",
    "Collectibles",
    "Fashion & Accessories",
    "Sports Memorabilia",
    "Books & Manuscripts",
    "Musical Instruments",
    "Toys & Hobbies",
  ];

  const conditions = ["New", "Refurbished", "Like New", "Good", "Fair", "Used"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors({ ...errors, image: null });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    URL.revokeObjectURL(imagePreview);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.category) newErrors.category = "Please select a category";
    if (!form.condition) newErrors.condition = "Please select condition";
    if (!form.startingBid) {
      newErrors.startingBid = "Starting bid is required";
    } else if (parseInt(form.startingBid) <= 0) {
      newErrors.startingBid = "Starting bid must be greater than 0";
    }
    if (!image) newErrors.image = "Please upload an image";
    if (!startTime) newErrors.startTime = "Please select start time";
    if (!endTime) newErrors.endTime = "Please select end time";
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      newErrors.timeRange = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "",
      condition: "",
      startingBid: "",
    });

    removeImage();
    setStartTime(null);
    setEndTime(null);
    setErrors({});
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const formData = new FormData();

    formData.append("itemImage", image);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("condition", form.condition);
    formData.append("startingPrice", parseInt(form.startingBid, 10));
    formData.append("startTime", startTime.toISOString());
    formData.append("endTime", endTime.toISOString());

    try {
      const res = await dispatch(createAuction(formData));

      if (res?.payload?.success) {
        toast.success("Auction created successfully!");
        resetForm();
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 3000);
      }
    } catch (error) {
      toast.error("Failed to create auction. Please try again.");
    }
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Auctioneer") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-block p-2 bg-orange-100 rounded-full mb-4">
            <TagIcon className="w-6 h-6 text-[#D6482B]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Create New Auction
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto">
            List your item for auction and reach thousands of potential buyers.
            Fill in the details below to get started.
          </p>
        </div>

        {/* Success Banner */}
        {formSubmitted && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fadeIn">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <p className="text-green-700 text-sm">
              Auction created successfully! The form has been reset.
            </p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-100 w-full">
            <div
              className="h-full bg-gradient-to-r from-[#D6482B] to-[#ff6b4a] transition-all duration-500"
              style={{
                width: `${
                  Object.values(form).filter((v) => v).length * 10 +
                  (image ? 10 : 0) +
                  (startTime ? 10 : 0) +
                  (endTime ? 10 : 0)
                }%`,
              }}
            />
          </div>

          <form onSubmit={handleCreateAuction} className="p-6 sm:p-8 space-y-6">
            {/* Title Field */}
            <div className="space-y-1.5">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <TagIcon className="w-4 h-4 mr-2 text-[#D6482B]" />
                Auction Title <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Vintage Rolex Submariner"
                className={`w-full px-4 py-3 border ${
                  errors.title ? "border-red-300 bg-red-50" : "border-gray-200"
                } rounded-lg focus:ring-2 focus:ring-[#D6482B] focus:border-transparent outline-none transition text-sm`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category and Condition Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.category
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-[#D6482B] focus:border-transparent outline-none appearance-none text-sm bg-white`}
                  >
                    <option value="">Select category</option>
                    {auctionCategories.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>

              {/* Condition */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Condition <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.condition
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-[#D6482B] focus:border-transparent outline-none appearance-none text-sm bg-white`}
                  >
                    <option value="">Select condition</option>
                    {conditions.map((cond) => (
                      <option key={cond}>{cond}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.condition && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.condition}
                  </p>
                )}
              </div>
            </div>

            {/* Starting Price */}
            <div className="space-y-1.5">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <CurrencyRupeeIcon className="w-4 h-4 mr-2 text-[#D6482B]" />
                Starting Bid (₹) <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input
                  type="number"
                  name="startingBid"
                  value={form.startingBid}
                  onChange={handleChange}
                  placeholder="50000"
                  min="1"
                  step="1"
                  className={`w-full pl-8 pr-4 py-3 border ${
                    errors.startingBid
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-[#D6482B] focus:border-transparent outline-none transition text-sm`}
                />
              </div>
              {errors.startingBid && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startingBid}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <DocumentTextIcon className="w-4 h-4 mr-2 text-[#D6482B]" />
                Description <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                rows="4"
                name="description"
                value={form.description}
                placeholder="Describe your item in detail... Include its features, condition, history, etc."
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.description
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                } rounded-lg focus:ring-2 focus:ring-[#D6482B] focus:border-transparent outline-none transition text-sm resize-none`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Time Selection */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <ClockIcon className="w-4 h-4 mr-2 text-[#D6482B]" />
                Auction Duration <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <DatePicker
                    selected={startTime}
                    onChange={(date) => {
                      setStartTime(date);
                      setErrors({
                        ...errors,
                        startTime: null,
                        timeRange: null,
                      });
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    placeholderText="Start Date & Time"
                    className={`w-full px-4 py-3 border ${
                      errors.startTime
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-[#D6482B] focus:border-transparent outline-none text-sm`}
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startTime}
                    </p>
                  )}
                </div>

                <div>
                  <DatePicker
                    selected={endTime}
                    onChange={(date) => {
                      setEndTime(date);
                      setErrors({ ...errors, endTime: null, timeRange: null });
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={startTime || new Date()}
                    placeholderText="End Date & Time"
                    className={`w-full px-4 py-3 border ${
                      errors.endTime
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-[#D6482B] focus:border-transparent outline-none text-sm`}
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>
              {errors.timeRange && (
                <p className="text-red-500 text-xs">{errors.timeRange}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-1.5">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <CameraIcon className="w-4 h-4 mr-2 text-[#D6482B]" />
                Auction Image <span className="text-red-500 ml-1">*</span>
              </label>

              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                  dragActive
                    ? "border-[#D6482B] bg-orange-50"
                    : errors.image
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-[#D6482B]"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <CameraIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 text-sm font-medium">
                      Click or drag image to upload
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D6482B] to-[#ff6b4a] text-white font-medium rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Auction"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            📝 Tips for a successful auction:
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Add clear, high-quality images of your item</li>
            <li>• Write a detailed description highlighting key features</li>
            <li>• Set a reasonable starting bid to attract more bidders</li>
            <li>• Choose appropriate category and condition</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateAuction;
