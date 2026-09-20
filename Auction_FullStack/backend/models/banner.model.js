import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Banner description is required."],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required."],
    },
    condition: {
      type: String,
      default: "Mint Condition",
    },
    startingPrice: {
      type: Number,
      required: [true, "Starting or featured price is required."],
    },
    bannerType: {
      type: String,
      enum: ["Upcoming", "Live Hot", "Exclusive"],
      default: "Upcoming",
    },
    badge: {
      type: String,
      default: "Super Admin Exclusive",
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required."],
    },
    endTime: {
      type: Date,
    },
    ctaText: {
      type: String,
      default: "Explore Upcoming",
      trim: true,
    },
    ctaLink: {
      type: String,
      default: "/auctions",
      trim: true,
    },
    itemImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
        required: [true, "Banner item image is required."],
      },
    },
    auctionItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Banner = mongoose.model("Banner", bannerSchema);
