import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: { type: String, required: true },
    condition:{
        type:String,
        enum:['New', 'Refurbished',"Semiused"],
    },
    startingPrice: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number, required: true,
        default: 0
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String
    },
    itemImge: {
        public_id: { type: String, required: true },
        url: { type: String, required: true }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bid: [
        {
            bidder: { type: mongoose.Schema.Types.ObjectId, ref: "Bid" },
            bidAmount: { type: Number, required: true },
            userName: {
                type: String
            },
            profileImage: {
                type: String
            }
        },
    ],
    highestBidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    commisionCalc: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

export const Auction = mongoose.model("Auction", auctionSchema);