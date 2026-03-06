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
  CurrencyDollarIcon,
  TagIcon,
  DocumentTextIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const CreateAuction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { loading } = useSelector((state) => state.auction);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    startingBid: "",
  });

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

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
  ];

  const conditions = [
    "New",
    "Like New",
    "Excellent",
    "Good",
    "Fair",
    "For Parts",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
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
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();

    if (!image) return alert("Please upload an image");
    if (!startTime || !endTime) return alert("Select start & end time");

    if (new Date(startTime) >= new Date(endTime))
      return alert("End must be after start");

    const formData = new FormData();

    formData.append("itemImage", image);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("condition", form.condition);
    formData.append("startingPrice", form.startingBid);
    formData.append("startTime", startTime.toISOString());
    formData.append("endTime", endTime.toISOString());

    const res = await dispatch(createAuction(formData));

    if (res?.payload?.success) {
      resetForm();
      alert("Auction Created Successfully");
    }
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Auctioneer") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-4">
      {/* 3 Column Layout */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-[260px_1fr_260px] gap-8">
        {/* LEFT BANNER */}
        <div className="hidden xl:flex justify-center">
          <div className="sticky top-32">
            <img
              src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
              className="w-[260px] h-[600px] object-cover rounded-2xl shadow-xl"
              alt="banner"
            />
          </div>
        </div>

        {/* CENTER FORM */}
        <div className="max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#D6482B] to-[#ff6b4a] bg-clip-text text-transparent">
              Create New Auction
            </h1>

            <p className="text-gray-600 text-lg mt-4">
              List your item for auction and reach thousands of potential
              buyers.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#D6482B] to-[#ff6b4a]" />

            <form onSubmit={handleCreateAuction} className="p-8 space-y-8">
              {/* TITLE */}
              <div>
                <label className="flex items-center font-semibold mb-2">
                  <TagIcon className="w-5 h-5 mr-2 text-[#D6482B]" />
                  Auction Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Vintage Rolex Submariner"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#D6482B]"
                  required
                />
              </div>

              {/* CATEGORY + CONDITION */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold mb-2 block">Category</label>

                  <div className="relative">
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl appearance-none"
                    >
                      <option value="">Select category</option>

                      {auctionCategories.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>

                    <ChevronDownIcon className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="font-semibold mb-2 block">Condition</label>

                  <div className="relative">
                    <select
                      name="condition"
                      value={form.condition}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl appearance-none"
                    >
                      <option value="">Select condition</option>

                      {conditions.map((cond) => (
                        <option key={cond}>{cond}</option>
                      ))}
                    </select>

                    <ChevronDownIcon className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* STARTING PRICE */}

              <div>
                <label className="flex items-center font-semibold mb-2">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2 text-[#D6482B]" />
                  Starting Bid
                </label>

                <input
                  type="number"
                  name="startingBid"
                  value={form.startingBid}
                  onChange={handleChange}
                  placeholder="0.01"
                  min="0.01"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="flex items-center font-semibold mb-2">
                  <DocumentTextIcon className="w-5 h-5 mr-2 text-[#D6482B]" />
                  Description
                </label>

                <textarea
                  rows="5"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl"
                />
              </div>

              {/* DATE PICKER */}

              <div className="grid md:grid-cols-2 gap-6">
                <DatePicker
                  selected={startTime}
                  onChange={(date) => setStartTime(date)}
                  showTimeSelect
                  placeholderText="Start Time"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl"
                />

                <DatePicker
                  selected={endTime}
                  onChange={(date) => setEndTime(date)}
                  showTimeSelect
                  placeholderText="End Time"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl"
                />
              </div>

              {/* IMAGE */}

              <div>
                <label className="flex items-center font-semibold mb-2">
                  <CameraIcon className="w-5 h-5 mr-2 text-[#D6482B]" />
                  Auction Image
                </label>

                <div
                  className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
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
                    <img
                      src={imagePreview}
                      className="max-h-80 mx-auto rounded-xl"
                    />
                  ) : (
                    <p>Drag image or click to upload</p>
                  )}
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-4 bg-gray-200 rounded-xl"
                >
                  Clear Form
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-[#D6482B] to-[#ff6b4a] text-white rounded-xl"
                >
                  {loading ? "Creating..." : "Create Auction"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT BANNER */}

        <div className="hidden xl:flex justify-center">
          <div className="sticky top-32">
            <img
              src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
              className="w-[500px] h-[600px] object-cover rounded-2xl shadow-xl"
              alt="banner"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;
