import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../middlewares/error.middleware.js";
import {Auction} from "../models/auction.model.js";
import mongoose from "mongoose";
export const checkAuctiontime=asyncHandler(async(req,res,next) => {
    const {id} =req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid auction id.", 400);
    }
    // Fing the auction
    const auctionItem=await Auction.findById(id);
    if(!auctionItem) {
        throw new ApiError("Auction not found.", 404);
    }
    const now=new Date();
    if(now>new Date(auctionItem.endTime)){
        throw new ApiError("Auction has ended", 403);
    }
    if(now<new Date(auctionItem.startTime)){
        throw new ApiError("Auction has not started yet", 403);
    }
    next();
});