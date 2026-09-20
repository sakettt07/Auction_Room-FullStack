import { Banner } from "../models/banner.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../middlewares/error.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// CREATE NEW BANNER (Super Admin)
const createBanner = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    condition,
    startingPrice,
    bannerType,
    badge,
    startTime,
    endTime,
    ctaText,
    ctaLink,
    auctionItem,
    imageUrl, // optional pre-existing image URL if cloned from an auction
  } = req.body;

  if (!title || !description || !category || !startingPrice || !startTime) {
    throw new ApiError("Title, description, category, starting price, and start time are required.", 400);
  }

  let imageData = {
    public_id: "",
    url: "",
  };

  // Case 1: Image file uploaded
  if (req.files && req.files.itemImage) {
    const { itemImage } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/jpg"];
    if (!allowedFormats.includes(itemImage.mimetype)) {
      throw new ApiError("Invalid image format. Allowed: PNG, JPEG, WEBP, JPG, AVIF.", 400);
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      itemImage.tempFilePath,
      {
        folder: "AuctionBanners",
      }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      throw new ApiError("Failed to upload banner image to Cloudinary.", 500);
    }

    imageData = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  } else if (imageUrl) {
    // Case 2: Cloned from existing auction item lot
    imageData = {
      public_id: "",
      url: imageUrl,
    };
  } else {
    throw new ApiError("A banner image file or image URL is required.", 400);
  }

  const newBanner = await Banner.create({
    title,
    description,
    category,
    condition: condition || "Mint Condition",
    startingPrice: Number(startingPrice),
    bannerType: bannerType || "Upcoming",
    badge: badge || "Super Admin Exclusive",
    startTime: new Date(startTime),
    endTime: endTime ? new Date(endTime) : undefined,
    ctaText: ctaText || "Explore Upcoming",
    ctaLink: ctaLink || (auctionItem ? `/auction/item/${auctionItem}` : "/auctions"),
    itemImage: imageData,
    auctionItem: auctionItem && mongoose.Types.ObjectId.isValid(auctionItem) ? auctionItem : undefined,
    createdBy: req.user._id,
    isActive: true,
  });

  return res.status(201).json(
    new ApiResponse(201, newBanner, "Banner created successfully")
  );
});

// GET ACTIVE BANNERS (Public - For Home Page Carousel)
const getActiveBanners = asyncHandler(async (req, res) => {
  const activeBanners = await Banner.find({ isActive: true })
    .populate("auctionItem", "title currentPrice startingPrice startTime endTime")
    .sort({ createdAt: -1 })
    .limit(10);

  return res.status(200).json(
    new ApiResponse(200, activeBanners, "Active banners fetched successfully")
  );
});

// GET ALL BANNERS (Super Admin - For Dashboard)
const getAllBanners = asyncHandler(async (req, res) => {
  const allBanners = await Banner.find()
    .populate("auctionItem", "title currentPrice startingPrice startTime endTime")
    .populate("createdBy", "userName email")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, allBanners, "All banners fetched successfully")
  );
});

// DELETE BANNER (Super Admin)
const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid banner ID.", 400);
  }

  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError("Banner not found.", 404);
  }

  if (banner.itemImage && banner.itemImage.public_id) {
    try {
      await cloudinary.uploader.destroy(banner.itemImage.public_id);
    } catch (err) {
      console.warn("Could not delete image from Cloudinary:", err.message);
    }
  }

  await banner.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, null, "Banner deleted successfully")
  );
});

// TOGGLE BANNER ACTIVE STATUS (Super Admin)
const toggleBannerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid banner ID.", 400);
  }

  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError("Banner not found.", 404);
  }

  banner.isActive = !banner.isActive;
  await banner.save();

  return res.status(200).json(
    new ApiResponse(200, banner, `Banner ${banner.isActive ? "activated" : "deactivated"} successfully`)
  );
});

export {
  createBanner,
  getActiveBanners,
  getAllBanners,
  deleteBanner,
  toggleBannerStatus,
};
