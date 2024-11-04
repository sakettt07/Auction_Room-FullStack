import { Auction } from "../models/auction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../middlewares/error.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose";



const addNewAuctionItem = asyncHandler(async (req, res) => {
    if (!req.files || Object.keys(req.files).length == 0) {
        throw new ApiError("item Image is required.", 400);
    }
    const { itemImage } = req.files;

    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jpg"]
    if (!allowedFormats.includes(itemImage.mimetype)) {
        throw new ApiError("Invalid item Image format. Only PNG, JPEG, WEBP, JPG are allowed.", 400);
    }
    const { title, description, category, condition, startingPrice, startTime, endTime } = req.body;
    if (!title || !description || !category || !startingPrice || !condition || !startTime || !endTime) {
        throw new ApiError("All fields are required.", 400);
    }

    //handling the time error
    if (new Date(startTime) < Date.now()) {
        throw new ApiError("Start Time should be in the future.", 400);
    }
    if (new Date(startTime) >= new Date(endTime)) {
        throw new ApiError("Start Time should not be in the future.", 400);
    }
    // now we will check if a person is already having a running auction
    const auctionRunning = await Auction.findOne({ createdBy: req.user.id, endTime: { $gt: Date.now() } });
    if (auctionRunning) {
        throw new ApiError("You can't have two running auctions at the same time.", 400);
    }
    // now managing the cloudinary.
    const cloudinaryResponse = await cloudinary.uploader.upload(
        itemImage.tempFilePath,
        {
            folder: "AuctionItems"
        }
    )
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        throw new ApiError(`Failed to upload auctionItem image to cloudinary ||${cloudinaryResponse.error}`, 500);
    }
    const auctionItem = await Auction.create({
        title,
        description,
        category,
        condition,
        startingPrice,
        startTime,
        endTime,
        createdBy: req.user._id,
        itemImage: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    })
    return res.status(201).json(new ApiResponse(200, auctionItem, `Auction listed successfully and will be visible on the page in ${startTime}`));
})
// To get the list of items that the user has posted to the auction.
const myAuctionItem = asyncHandler(async (req, res) => {
    // now if the user is loggin then its token must be there
    const user = req.user;
    if (!user) {
        throw new ApiError("User not found.", 404);
    }
    // now we will fetch the auctions that the user has posted to the auction.
    // we will use the createdBy field in the Auction model.
    const myAuctions = await Auction.find({ createdBy: user._id });
    res.status(200).json(new ApiResponse(200, myAuctions, "Auctions fetched successfully"));
 });

// to list all the auction items that the user has posted to the auction.
const getAllItems = asyncHandler(async (req, res) => {
    // fetch all the items from the database
    const items = await Auction.find();
    res.status(200).json(new ApiResponse(200, items, "Items fetched successfully"));
});

// to remove any auction item that the user has posted to the auction.
const removeItem = asyncHandler(async (req, res) => {
    const {id}=req.params;
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
    if (auctionItem.createdBy.toString()!== req.user._id.toString()) {
        throw new ApiError("You are not authorized to remove this auction.", 403);
    }
    // now we will be removing the auction from the database.
    await auctionItem.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Auction removed successfully"));

})
const getAuctionDetails = asyncHandler(async (req, res) => {
    // to ge the auction details of any particular auction.
    const { id } = req.params;
    //checking the format of the id in the database
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
    // now we will be fetching the bidders that will also be shown on the auction page if that item is in the auction
    const bidders = auctionItem.bids.sort((a, b) => b.bid - a.bid);
    return res.status(200).json(new ApiResponse(200, { auctionItem, bidders }, "Auction details fetched successfully"));
})
const republishItem = asyncHandler(async (req, res) => {
    // to republish the auction details of any particular auction.
    const { id } = req.params;
    //checking the format of the id in the database
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid auction id.", 400);
    }
    // now fetching the auction details from the database using the id.
    const auctionItem = await Auction.findById(id);
    if (!auctionItem) {
        throw new ApiError("Auction not found.", 404);
    }
    // now we will be checking if the auction belongs to the user who is logged in.
    if (auctionItem.createdBy.toString()!== req.user._id.toString()) {
        throw new ApiError("You are not authorized to republish this auction.", 403);
    }
    // check if the auction is running or not
    if(auctionItem.endTime>Date.now()){
        throw new ApiError("Auction is already running.", 400);
    }
    // now we will be republishing the auction by setting the new start and the end time.
    let data={
        startTime:new Date(req.body.startTime),
        endTime:new Date(req.body.endTime),
    };
    if(data.startTime<Date.now()){
        throw new ApiError("Start Time should be in the future.", 400)
    }
    if(data.startTime>=data.endTime){
        throw new ApiError("Start Time should not be in the future.", 400);
    }

    



})
export { addNewAuctionItem, getAllItems, getAuctionDetails, removeItem, myAuctionItem, republishItem };