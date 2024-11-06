import ApiError from "../middlewares/error.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const placebid=asyncHandler(async(req,res)=>{
    // get the item on which we are going to bid
    const {id} =req.params;
    const auctionitem=await Auction.findById(id);
    if(!auctionitem){
        throw new ApiError("Couldn't find auction item",400);
    }
    const {amount}=req.body;
    if(!amount){
        throw new ApiError("Place your bidding amount",400);
    }
    if(amount<=auctionitem.currentPrice){
        throw new ApiError("Amount should be more than current price",400);
    }
    if(amount<auctionitem.startPrice){
        
    }

})
export{placebid};