import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "./error.middleware.js";

export const trackCommission=asyncHandler(async(req,res,next)=>{
    // fetch the user first
    const user=await User.findById(req.user._id);
    if(user.unpaidCommission>0){
        throw new ApiError("You have unpaid commission left please pay that first to go ahead or post new auction.",403);
    }
    next();
});