import ApiError from "../middlewares/error.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Paymentproof } from "../models/commissionProof.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { Auction } from "../models/auction.model.js";
import mongoose from "mongoose";

const calculateCommision = async (auctionId) => {

    const auction = await Auction.findById(auctionId);
    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        throw new ApiError("Invalid auction id.", 400);
    }
    const commissionRate = 0.09;
    const commission = auction.currentPrice * commissionRate;

    return commission;
}


const commissionProof = asyncHandler(async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        throw new ApiError("Commission Proof Image is required.", 400);
    }

    const { proofImage } = req.files;
    const { amount, comment } = req.body;

    if (!amount) {
        throw new ApiError("Amount is required", 400);
    }

    const parsedAmount = Number(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new ApiError("Invalid amount", 400);
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError("User not found.", 404);
    }

    if (user.unpaidCommission === 0) {
        return res.status(200).json(
            new ApiResponse(200, null, "You don't have unpaid commission")
        );
    }

    if (parsedAmount > user.unpaidCommission) {
        throw new ApiError(
            `Amount exceeds unpaid commission. Max allowed ${user.unpaidCommission}`,
            400
        );
    }

    const allowedFormats = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/jpg",
        "image/avif",
    ];

    if (!allowedFormats.includes(proofImage.mimetype)) {
        throw new ApiError("Invalid image format", 400);
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        proofImage.tempFilePath,
        { folder: "CommissionProof" }
    );

    if (!cloudinaryResponse) {
        throw new ApiError("Cloudinary upload failed", 500);
    }

    const commissionProofPayment = await Paymentproof.create({
        userId: req.user._id,
        proofImage: {
            publicId: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
        amount: parsedAmount,
        comment: comment || "",
    });

    res.status(200).json(
        new ApiResponse(
            200,
            commissionProofPayment,
            "Commission proof submitted successfully"
        )
    );
});

export { commissionProof, calculateCommision };