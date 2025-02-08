// This controller will be performing all the platform admin responsibilities which will operate both on auctioneer and the bidder functions.
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  ApiError  from "../middlewares/error.middleware.js";
import mongoose from "mongoose";
import { Auction } from "../models/auction.model.js";
import {User} from "../models/user.model.js";
import {Commission} from "../models/commission.model.js";
import { Paymentproof } from "../models/commissionProof.model.js";

// Platform admin can delete the auction if it finds out to be not that much engaging or of no use as it will help the platform to look clean.
const deleteAuctionItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid auction id.", 400);
    }
    // now fetching the auction details from the database using the id.
    // if the auction does not exist then it will throw an error.
    // if the auction exists then it will return the auction details.
    const auctionItem = await Auction.findById(id);
    if (!auctionItem) {
        throw new ApiError("Auction not found.", 404);
    }
    // now we will be checking if the auction belongs to the user who is logged in.
    if (auctionItem.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to remove this auction.", 403);
    }
    // now we will be removing the auction from the database.
    await auctionItem.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Auction removed successfully"));
})
const getPaymentproofs = asyncHandler(async (req, res) => {
    let paymentproofs = await Paymentproof.find();
    if (!paymentproofs) {
        throw new ApiError("Payment proofs not found.", 404);
    }
    return res.status(200).json(new ApiResponse(200, paymentproofs, "Payment proofs fetched successfully"));
})
const getpaymentDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid payment proof id.", 400);
    }
    // now fetching the payment proof details from the database using the id.
    // if the payment proof does not exist then it will throw an error.
    // if the payment proof exists then it will return the payment proof details.
    const paymentProof = await Paymentproof.findById(id);
    if (!paymentProof) {
        throw new ApiError("Payment proof not found.", 404);
    }
    // now we will be checking if the payment proof belongs to the user who is logged in.
    return res.status(200).json(new ApiResponse(200, paymentProof, "Payment proof"));
})
// only  the super admin can change the payment status
const updateProofStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId(id)) {
        throw new ApiError("Invalid payment proof id.", 400);
    }
    const { amount, status } = req.body;
    if (!amount || !status) {
        throw new ApiError("Please provide all the required fields.", 400);
    }
    // find the proof
    let proof = await Paymentproof.findById(id);
    if (!proof) {
        throw new ApiError("Payment proof not found.", 404);
    }
    proof = await Paymentproof.findByIdAndUpdate(id, {
        status, amount
    },
        { new: true, runValidators: true, useFindAndModify: true})

        return res.status(200).json(new ApiResponse(200, { status: status},"Payment proof updated successfully"));
})
const deletePaymentproof=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError("Invalid payment proof id.", 400);
    }
    let proof=Paymentproof.findById(id);
    if(!proof){
        throw new ApiError("Payment proof not found.", 404);
    }
    await proof.deleteOne();
    return res.status(200).json(new ApiResponse(200, null,"Payment proof deleted successfully"));
})
// it is not fethcing the normal user but we want to fetch the users on hte basis of there roles on the platform.
const fetchAllUsers = asyncHandler(async(req,res)=>{
    const users=await User.aggregate([
        // what we want to group the users
        {
            $group:{
                _id:{
                    month:{$month:"$createdAt"},
                    year:{$year:"$createdAt"},
                    role:"$role",
                },
                count:{
                    $sum:1
                },
            },
        },
        // what response will be visible at the testing end.
        {
            $project:{
                _id:0,
                month:"$_id.month",
                year:"$_id.year",
                role:"$_id.role",
                count:"$count",
                _id:0,
            },
        },
        // sorting the users in the ascending order.
        {
            $sort:{
                year:1,
                month:1,
            },
        }
    ]);

    const bidders=users.filter((user)=>user.role=="Bidder");
    const auctioneers=users.filter((user)=>user.role=="Auctioneer");

    const transformDataToMonthCollection =(data,totalMonths=12)=>{
        const result=Array(totalMonths).fill(0);

        data.forEach((item)=>{
            const index=item.month-1;
            result[index]=item.count;
        })
        return result;
    }

    const biddersCount=transformDataToMonthCollection(bidders);
    const auctioneersCount=transformDataToMonthCollection(auctioneers);

    // the response

    res.status(200).json(new ApiResponse(200,{biddersCount,auctioneersCount},"Successfully fetched the sorted data of the bidders and the auctioneeers count in the whole year"))
    
})
const monthlyRevenue =asyncHandler(async(req,res)=>{
    const payments=await Commission.aggregate([{
        $group:{
            _id:{
                month:{$month:"$createdAt"},
                year:{$year:"$createdAt"},
            },
            totalCommission:{
                $sum:"$amount"
            }
        }
    },{
        $sort:{
            "id_year":1,
            "id_month":1
        }
    }])
    const transformDataToMonthCollection=(payments,totalMonths=12)=>{
        const result=Array(totalMonths).fill(0);
        payments.forEach((payment)=>{
            const index=payment._id.month-1;
            result[index]=payment.totalCommission;
        });
        return result;
    }
    const totalRevenueGen=transformDataToMonthCollection(payments);

    res.status(200).json(new ApiResponse(200,totalRevenueGen,"Successfully fetched the total revenue generated in the whole year"))
})

export { deleteAuctionItem, getPaymentproofs, getpaymentDetails ,updateProofStatus,deletePaymentproof,fetchAllUsers,monthlyRevenue } ;