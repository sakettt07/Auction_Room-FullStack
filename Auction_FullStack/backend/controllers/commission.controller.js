import ApiError from "../middlewares/error.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Paymentproof } from "../models/commissionProof.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {v2 as cloudinary} from "cloudinary";


const commissionProof=asyncHandler(async(req,res)=>{
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
    if (!user) {
        throw new ApiError("User not found.", 404)
    }
    if(user.unpaidCommission===0){
        return res.status(200).json(new ApiResponse(200, null, "You don't have any unpaid commission to pay"));
    }
    if(user.unpaidCommission<amount){
        throw new ApiError(`The amount exceeds your unpaid commission please enter an amount upto ${user.unpaidCommission}`,400);
    }
    if(amount<user.unpaidCommission){
        return res.status(200).json(new ApiResponse(200,null,`You have paid ${amount} out of ${user.unpaidCommission} now your are left with ${user.unpaidCommission-amount}`)
)}

    // now check the file format and save in the cloudinary
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jpg"]
    if (!allowedFormats.includes(proofImage.mimetype)) {
        throw new ApiError("Invalid Profile Image format. Only PNG, JPEG, WEBP, JPG are allowed.", 400);
    }
    // now managing the cloudinary.
    const cloudinaryResponse=await cloudinary.uploader.upload(
        proofImage.tempFilePath,
        {
            folder:"CommissionProof"
        }
    )
    if(!cloudinaryResponse || cloudinaryResponse.error){
        throw new ApiError(`Failed to upload commission proof image to cloudinary.${cloudinaryResponse.error}`, 500);
    }
    // now we can create the proof finally
    const commissionProofPayment=await Paymentproof.create({
        userId:req.user._id,
        proofImage:{
            publicId:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        },
        amount,
        comment
    })
    res.status(200).json(new ApiResponse(200,commissionProofPayment,"Your commission proof has been submitted successfully"));
})

export{commissionProof};