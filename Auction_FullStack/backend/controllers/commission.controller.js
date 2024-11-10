import ApiError from "../middlewares/error.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Paymentproof } from "../models/commissionProof.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import {v2 as cloudinary} from "cloudinary";
export const commissionProof=asyncHandler(async(req,res)=>{
    // fetch the files first and the data
    if(!req.files|| Object.keys(req.files).length===0){
        throw new ApiError("Commission Proof Image is required.",400);
    }
    const { proofImage }=req.files;
    const {amount,comment}=req.body;
    if(!amount||!comment){
        throw new ApiError("amount and comment are required fields",400);
    }
    // fetching the user
    const user=await User.findById(req.user._id);
    if(user.unpaidCommission===0){
        throw new ApiResponse(200,"You don't have any unpaid commission to pay");
    }
    if(user.unpaidCommission<amount){
        throw new ApiError(`Thw amount exceeds your unpaid commission please enter an amount upto ${user.unpaidCommission}`,400);
    }

    // now check the file format and save in the cloudinary
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jpg"]
    if (!allowedFormats.includes(proofImage.mimetype)) {
        throw new ApiError("Invalid Profile Image format. Only PNG, JPEG, WEBP, JPG are allowed.", 400);
    }
})