import ApiError from "../middlewares/error.middleware.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {v2 as cloudinary} from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";


const registerUser = asyncHandler(async (req, res) => {

    // fetching the image files first.
    if (!req.files || Object.keys(req.files).length == 0) {
        throw new ApiError("Profile Image is required.", 400);
    }
    const { profileImage } = req.files;

    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jpg"]
    if (!allowedFormats.includes(profileImage.mimetype)) {
        throw new ApiError("Invalid Profile Image format. Only PNG, JPEG, WEBP, JPG are allowed.", 400);
    }
    // now fetching the users data.
    const { userName, password, email, phone, address, role, bankAccountNumber, bankAccountName, bankName,paypalEmail,stripeEmail } = req.body;

    if(!userName || !password || !email || !phone || !address || !role){
        throw new ApiError("All fields are required.", 400);
    }
    if(role=="Auctioneer"){
        if(!bankAccountNumber ||!bankAccountName ||!bankName){
            throw new ApiError("Bank Account Details are required for Auctioneer.", 400);
        }
    }
    if(!stripeEmail){
        throw new ApiError("Please provide your stripe Email");
    }
    if(!paypalEmail){
        throw new ApiError("Please provide your Paypal Email");
    }
    const isRegistered=await User.findOne({ email});
    if(isRegistered){
        throw new ApiError("Email already exists.", 400);
    }
    // now managing the cloudinary.
    const cloudinaryResponse=await cloudinary.uploader.upload(
        profileImage.tempFilePath,
        {
            folder:"AuctionUsers"
        }
    )
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "cloudinaryError",cloudinaryResponse.error||"Unknown cloudinary error"
        )
        throw new ApiError("Failed to upload profile image to cloudinary.", 500);
    }
    // storing the user data.
    const user=new User({
        userName,
        password,
        email,
        phone,
        address,
        role,
        profileImage:{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        },
        paymentMethods: {
            bankTransfer: {
              bankAccountNumber,
              bankAccountName,
              bankName,
            },
            stripe: {
              stripeEmail,
            },
            paypal: {
              paypalEmail
          },
        }
    });
    await user.save();
    generateToken(user,"User created successfully",200,res);

    
})
const loginUser = asyncHandler(async (req, res) => {

})
export { registerUser, loginUser }