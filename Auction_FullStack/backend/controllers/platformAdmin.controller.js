import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../middlewares/error.middleware.js";
import mongoose from "mongoose";

import { Auction } from "../models/auction.model.js";
import { User } from "../models/user.model.js";
import { Commission } from "../models/commission.model.js";
import { Paymentproof } from "../models/commissionProof.model.js";


// DELETE AUCTION
const deleteAuctionItem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid auction id.", 400);
    }

    const auctionItem = await Auction.findById(id);

    if (!auctionItem) {
        throw new ApiError("Auction not found.", 404);
    }

    await auctionItem.deleteOne();

    res
        .status(200)
        .json(new ApiResponse(200, null, "Auction removed successfully"));
});


// GET ALL PAYMENT PROOFS
const getPaymentproofs = asyncHandler(async (req, res) => {

    const paymentproofs = await Paymentproof.find()
        .populate({
            path: "userId",
            select: "userName email role",
        })
        .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(
            200,
            paymentproofs,
            "Payment proofs fetched successfully"
        )
    );
});


// GET SINGLE PAYMENT PROOF
const getpaymentDetails = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid payment proof id.", 400);
    }

    const paymentProof = await Paymentproof.findById(id).populate({
        path: "userId",
        select: "userName email role",
    });

    if (!paymentProof) {
        throw new ApiError("Payment proof not found.", 404);
    }

    res.status(200).json(
        new ApiResponse(200, paymentProof, "Payment proof fetched")
    );
});


// UPDATE PAYMENT STATUS
const updateProofStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid payment proof id.", 400);
    }

    if (!amount || !status) {
        throw new ApiError("Amount and status are required.", 400);
    }

    const proof = await Paymentproof.findById(id);

    if (!proof) {
        throw new ApiError("Payment proof not found.", 404);
    }

    // Get user who uploaded payment proof
    const user = await User.findById(proof.userId);

    if (!user) {
        throw new ApiError("User not found.", 404);
    }

    // Prevent duplicate commission deduction
    const wasPreviouslyApproved = proof.status === "Approved";

    // Update payment proof
    proof.amount = amount;
    proof.status = status;

    await proof.save();

    // Deduct unpaid commission only when status becomes Approved
    if (status === "Approved" && !wasPreviouslyApproved) {
        user.unpaidCommission = Math.max(
            0,
            user.unpaidCommission - Number(amount)
        );

        await user.save();
    }

    res.status(200).json(
        new ApiResponse(
            200,
            proof,
            "Payment proof updated and commission adjusted successfully"
        )
    );
});


// DELETE PAYMENT PROOF
const deletePaymentproof = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid payment proof id.", 400);
    }

    const proof = await Paymentproof.findById(id);

    if (!proof) {
        throw new ApiError("Payment proof not found.", 404);
    }

    await proof.deleteOne();

    res.status(200).json(
        new ApiResponse(200, null, "Payment proof deleted successfully")
    );
});


// FETCH USER STATS
const fetchAllUsers = asyncHandler(async (req, res) => {

    const users = await User.aggregate([
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                    role: "$role",
                },
                count: { $sum: 1 },
            },
        },
    ]);

    const bidders = users.filter((u) => u._id.role === "Bidder");
    const auctioneers = users.filter((u) => u._id.role === "Auctioneer");

    const transform = (data) => {
        const result = Array(12).fill(0);

        data.forEach((item) => {
            const index = item._id.month - 1;
            result[index] = item.count;
        });

        return result;
    };

    res.status(200).json(
        new ApiResponse(
            200,
            {
                biddersCount: transform(bidders),
                auctioneersCount: transform(auctioneers),
            },
            "User stats fetched successfully"
        )
    );
});


// MONTHLY REVENUE
const monthlyRevenue = asyncHandler(async (req, res) => {

    const payments = await Commission.aggregate([
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
                totalCommission: { $sum: "$amount" },
            },
        },
    ]);

    const result = Array(12).fill(0);

    payments.forEach((payment) => {
        const index = payment._id.month - 1;
        result[index] = payment.totalCommission;
    });

    res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Successfully fetched monthly revenue"
        )
    );
});

export {
    deleteAuctionItem,
    getPaymentproofs,
    getpaymentDetails,
    updateProofStatus,
    deletePaymentproof,
    fetchAllUsers,
    monthlyRevenue,
};