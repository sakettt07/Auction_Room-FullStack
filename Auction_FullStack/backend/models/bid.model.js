import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    auctionItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auction",
        required: true,
        index: true,
    },
});

// Helpful compound index for querying bids per auction & bidder
bidSchema.index({ auctionItem: 1, bidder: 1 });

export const Bid = mongoose.model("Bid", bidSchema);