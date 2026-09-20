import { Banner } from "../models/banner.model.js";
import { Auction } from "../models/auction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../middlewares/error.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Helper to enhance banner with live auction lot data
// Helper to enhance banner with live auction lot data
const enrichBannerWithLiveLot = async (bannerDoc) => {
  const banner = bannerDoc.toObject ? bannerDoc.toObject() : { ...bannerDoc };
  let item = null;

  if (banner.auctionItem && typeof banner.auctionItem === "object" && banner.auctionItem._id) {
    item = banner.auctionItem;
  } else if (banner.auctionItem && mongoose.Types.ObjectId.isValid(banner.auctionItem)) {
    item = await Auction.findById(banner.auctionItem).populate("highestBidder", "userName email profileImage");
  } else if (banner.title) {
    item = await Auction.findOne({ title: new RegExp(`^${banner.title.trim()}$`, "i") }).populate("highestBidder", "userName email profileImage");
  }

  if (item) {
    // If auctionItem wasn't attached, attach it now
    if (!banner.auctionItem) {
      banner.auctionItem = item;
    }
    // Sync current price / bid
    if (item.currentPrice && item.currentPrice > 0) {
      banner.currentBid = item.currentPrice;
    }
    // Sync total bids count from item.bids
    if (Array.isArray(item.bids) && item.bids.length > 0) {
      banner.totalBids = item.bids.length;
    } else if (banner.currentBid > banner.startingPrice && (!banner.totalBids || banner.totalBids === 0)) {
      banner.totalBids = 1;
    }
    // Sync end time and start time if not explicitly provided
    if (!banner.endTime && item.endTime) {
      banner.endTime = item.endTime;
    }
    if (!banner.startTime && item.startTime) {
      banner.startTime = item.startTime;
    }
    // Sync winner if concluded or highest bidder
    const highestBidderName =
      item.highestBidder?.userName ||
      (item.bids && item.bids.length > 0
        ? item.bids[item.bids.length - 1]?.userName
        : "");
    if (!banner.winnerName && highestBidderName) {
      banner.winnerName = highestBidderName;
    }
    if (!banner.winningPrice && item.currentPrice) {
      banner.winningPrice = item.currentPrice;
    }
  }
  return banner;
};

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
    currentBid,
    totalBids,
    winnerName,
    winningPrice,
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

  // Resolve auction lot details if linked
  let resolvedCurrentBid = currentBid ? Number(currentBid) : undefined;
  let resolvedTotalBids = totalBids !== undefined && totalBids !== "" ? Number(totalBids) : 0;
  let resolvedWinnerName = winnerName ? winnerName.trim() : "";
  let resolvedWinningPrice = winningPrice ? Number(winningPrice) : undefined;
  let resolvedEndTime = endTime ? new Date(endTime) : undefined;

  if (auctionItem && mongoose.Types.ObjectId.isValid(auctionItem)) {
    const lot = await Auction.findById(auctionItem).populate("highestBidder", "userName email");
    if (lot) {
      if (resolvedCurrentBid === undefined && lot.currentPrice > 0) {
        resolvedCurrentBid = lot.currentPrice;
      }
      if (!resolvedTotalBids && Array.isArray(lot.bids)) {
        resolvedTotalBids = lot.bids.length;
      }
      if (!resolvedWinnerName) {
        resolvedWinnerName =
          lot.highestBidder?.userName ||
          (lot.bids && lot.bids.length > 0 ? lot.bids[lot.bids.length - 1]?.userName : "");
      }
      if (!resolvedWinningPrice && lot.currentPrice > 0) {
        resolvedWinningPrice = lot.currentPrice;
      }
      if (!resolvedEndTime && lot.endTime) {
        resolvedEndTime = new Date(lot.endTime);
      }
    }
  }

  const newBanner = await Banner.create({
    title,
    description,
    category,
    condition: condition || "Mint Condition",
    startingPrice: Number(startingPrice),
    currentBid: resolvedCurrentBid,
    totalBids: resolvedTotalBids,
    winnerName: resolvedWinnerName,
    winningPrice: resolvedWinningPrice,
    bannerType: bannerType || "Upcoming",
    badge: badge || "Super Admin Exclusive",
    startTime: new Date(startTime),
    endTime: resolvedEndTime,
    ctaText: ctaText || "Explore Upcoming",
    ctaLink: ctaLink || (auctionItem ? `/auction/item/${auctionItem}` : "/auctions"),
    itemImage: imageData,
    auctionItem: auctionItem && mongoose.Types.ObjectId.isValid(auctionItem) ? auctionItem : undefined,
    createdBy: req.user._id,
    isActive: true,
  });

  const enrichedNewBanner = await enrichBannerWithLiveLot(newBanner);

  return res.status(201).json(
    new ApiResponse(201, enrichedNewBanner, "Banner created successfully")
  );
});

// GET ACTIVE BANNERS (Public - For Home Page Carousel)
const getActiveBanners = asyncHandler(async (req, res) => {
  const activeBanners = await Banner.find({ isActive: true })
    .populate({
      path: "auctionItem",
      select: "title currentPrice startingPrice startTime endTime bids highestBidder itemImage category condition",
      populate: {
        path: "highestBidder",
        select: "userName email profileImage",
      },
    })
    .sort({ createdAt: -1 })
    .limit(10);

  const enrichedBanners = await Promise.all(activeBanners.map(enrichBannerWithLiveLot));

  return res.status(200).json(
    new ApiResponse(200, enrichedBanners, "Active banners fetched successfully")
  );
});

// GET ALL BANNERS (Super Admin - For Dashboard)
const getAllBanners = asyncHandler(async (req, res) => {
  const allBanners = await Banner.find()
    .populate({
      path: "auctionItem",
      select: "title currentPrice startingPrice startTime endTime bids highestBidder itemImage category condition",
      populate: {
        path: "highestBidder",
        select: "userName email profileImage",
      },
    })
    .populate("createdBy", "userName email")
    .sort({ createdAt: -1 });

  const enrichedBanners = await Promise.all(allBanners.map(enrichBannerWithLiveLot));

  return res.status(200).json(
    new ApiResponse(200, enrichedBanners, "All banners fetched successfully")
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
