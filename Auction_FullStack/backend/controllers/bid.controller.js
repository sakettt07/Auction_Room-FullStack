import ApiError from "../middlewares/error.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Auction } from "../models/auction.model.js";
import { Bid } from "../models/bid.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const placebid = asyncHandler(async (req, res) => {
    // get the item on which we are going to bid
    const { id } = req.params;
    const auctionitem = await Auction.findById(id);
    if (!auctionitem) {
        throw new ApiError("Couldn't find auction item", 400);
    }
    const { amount } = req.body;
    if (!amount) {
        throw new ApiError("Place your bidding amount", 400);
    }
    if (amount <= auctionitem.currentPrice) {
        throw new ApiError("Amount should be more than current price", 400);
    }
    if (amount < auctionitem.startingPrice) {
        throw new ApiError("Amount should be more than starting price", 400);
    }
    let newBid;
    // check if user has already bid on this item
    try {
        const existingBid = await Bid.findOne({
            auctionItem: auctionitem._id,
            bidder: req.user._id,
        })
        const existingBidInAuction = auctionitem.bids.find((bid) => bid.bidder.toString() == req.user._id.toString());
        if (existingBidInAuction && existingBid) {
            existingBidInAuction.bidAmount = amount;
            existingBid.amount = amount;
            await existingBid.save();
        }
        // we have checked if user has already bid now if he has not placed a single bid then create his bid
        else {
            const BidDetails = await User.findById(req.user._id);
            newBid = await Bid.create({
                bidder: req.user._id,
                auctionItem: auctionitem._id,
                amount: amount,
            });
            auctionitem.bids.push({
                bidder: req.user._id,
                bidAmount: amount,
                userName: BidDetails.userName,
                profileImage: BidDetails.profileImage?.url
            });
        }
        auctionitem.currentPrice = amount;
        await auctionitem.save();
        res.status(201).json(new ApiResponse(200, {currentPrice: auctionitem.currentPrice,
            bid:newBid || existingBid
        }, "bid placed successfully"));
    } catch (error) {
        throw new ApiError(error.message || "Failed to place the bid", 500)
    }


})
export { placebid };