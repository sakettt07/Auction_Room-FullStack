import { User } from "../models/user.model.js";
import {Auction} from "../models/auction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../middlewares/error.middleware.js";
import {v2 as cloudinary} from "cloudinary";


const addNewAuctionItem = asyncHandler(async(req,res)=>{
        if (!req.files || Object.keys(req.files).length == 0) {
            throw new ApiError("item Image is required.", 400);
        }
        const { itemImage } = req.files;
    
        const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jpg"]
        if (!allowedFormats.includes(itemImage.mimetype)) {
            throw new ApiError("Invalid item Image format. Only PNG, JPEG, WEBP, JPG are allowed.", 400);
        }
        const {title,description,category,condition,startingPrice,startTime,endTime}=req.body;
        if(!title || !description || !category || !startingPrice || ! condition || !startTime || !endTime){
            throw new ApiError("All fields are required.", 400);
        }
    
        //handling the time error
        if(new Date(startTime)<Date.now()){
            throw new ApiError("Start Time should be in the future.", 400);
        }
        if(new Date(startTime)>=new Date(endTime)){
            throw new ApiError("Start Time should not be in the future.", 400);
        }
        // now we will check if a person is already having a running auction
        const auctionRunning=await Auction.findOne({createdBy:req.user.id, endTime:{$gt:Date.now()}});
        if(auctionRunning){
            throw new ApiError("You can't have two running auctions at the same time.", 400);
        }
        // now managing the cloudinary.
        const cloudinaryResponse=await cloudinary.uploader.upload(
            itemImage.tempFilePath,
            {
                folder:"AuctionItems"
            }
        )
        if(!cloudinaryResponse || cloudinaryResponse.error){
            throw new ApiError(`Failed to upload auctionItem image to cloudinary ||${cloudinaryResponse.error}`, 500);
        }
        const auctionItem=await Auction.create({
            title,
            description,
            category,
            condition,
            startingPrice,
            startTime,
            endTime,
            createdBy:req.user._id,
            itemImage:{
                public_id:cloudinaryResponse.public_id,
                url:cloudinaryResponse.secure_url,
            }
        })
        return res.status(201).json(new ApiResponse(200,auctionItem,`Auction listed successfully and will be visible on the page in ${startTime}`));
})
// To get the list of items that the user has posted to the auction.
const myAuctionItem = asyncHandler(async(req,res) => {

})
const getAllItems = asyncHandler(async(req,res) =>{

});
const removeItem=asyncHandler(async(req,res)=>{

})
const getAuctionDetails=asyncHandler(async(req,res)=>{

})
export{addNewAuctionItem,getAllItems,getAuctionDetails,removeItem,myAuctionItem};