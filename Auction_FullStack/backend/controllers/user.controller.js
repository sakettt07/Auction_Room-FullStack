import ApiError from "../middlewares/error.middleware.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendNewUserEmail } from "../utils/sendNewUserEmail.js";


const registerUser = asyncHandler(async (req, res) => {

    // fetching the image files first.
    if (!req.files || Object.keys(req.files).length == 0) {
        throw new ApiError("Profile Image is required.", 400);
    }
    const { profileImage } = req.files;

    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jpg", "image/avif"]
    if (!allowedFormats.includes(profileImage.mimetype)) {
        throw new ApiError("Invalid Profile Image format. Only PNG, JPEG, WEBP, JPG are allowed.", 400);
    }
    // now fetching the users data.
    const { userName, password, email, phone, address, role, bankAccountNumber, bankAccountName, bankName, paypalEmail, stripeEmail } = req.body;

    if (!userName || !password || !email || !phone || !address || !role) {
        throw new ApiError("All fields are required.", 400);
    }
    if (role === "Auctioneer") {
        if (!bankAccountNumber || !bankAccountName || !bankName) {
            throw new ApiError("Bank Account Details are required for Auctioneer.", 400);
        }
    }
    if (role !== "Bidder") {
        if (!stripeEmail && !paypalEmail) {
            throw new ApiError("Please provide either Stripe or Paypal Email", 400);
        }
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        throw new ApiError("Email already exists.", 400);
    }
    // now managing the cloudinary.
    const cloudinaryResponse = await cloudinary.uploader.upload(
        profileImage.tempFilePath,
        {
            folder: "AuctionUsers"
        }
    )
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        throw new ApiError(`Failed to upload profile image to cloudinary. ${cloudinaryResponse.error}`, 500);
    }
    // storing the user data.
    const user = new User({
        userName,
        password,
        email,
        phone,
        address,
        role,
        profileImage: {
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
    sendNewUserEmail(user).catch((err) => {
        console.error("Error sending welcome email:", err);
    });

    generateToken(user, "User created successfully", 200, res);


})
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError("All fields are required.", 400);
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError("Invalid credentials.", 401);
    }
    //user ne jo password enter kara h wo match bhi toh karna h.
    const isMatch = await user.comparepassword(password);
    if (!isMatch) {
        throw new ApiError("The password you have entered is incorrect", 401);
    }
    //agr match hojaye toh user ko login kardo and new token banado
    generateToken(user, "User logged in successfully", 200, res);

})
const getUser = asyncHandler(async (req, res) => {
    // now if the user is loggin then its token must be there
    const user = req.user;
    if (!user) {
        throw new ApiError("User not found.", 404);
    }
    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
})
const logoutUser = asyncHandler(async (req, res) => {
    //basically hume bas saved cookie ko clear karna h
    res.status(200).cookie("token", "", {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }).json(new ApiResponse(200, {}, "User Logged out Successfully"));
})
const fetchLeaderBoard = asyncHandler(async (req, res) => {
    const users = await User.find({ moneySpent: { $gt: 0 } }).select("-phone");
    const leaderBoard = users.sort((a, b) => b.moneySpent - a.moneySpent).slice(0, 10);
    res.status(200).json(new ApiResponse(200, leaderBoard, "Leaderboard fetched"));
})

const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError("User not found.", 404);
    }

    // Handle Profile Image Upload
    if (req.files && req.files.profileImage) {
        const { profileImage } = req.files;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jpg", "image/avif"];
        if (!allowedFormats.includes(profileImage.mimetype)) {
            throw new ApiError("Invalid image format. Only PNG, JPEG, WEBP, JPG, and AVIF are allowed.", 400);
        }

        // Delete old image from Cloudinary if it exists
        if (user.profileImage?.public_id) {
            try {
                await cloudinary.uploader.destroy(user.profileImage.public_id);
            } catch (err) {
                console.error("Failed to delete previous image from Cloudinary:", err);
            }
        }

        // Upload new image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(
            profileImage.tempFilePath,
            {
                folder: "AuctionUsers",
            }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            throw new ApiError(`Failed to upload profile image to Cloudinary. ${cloudinaryResponse?.error || ''}`, 500);
        }

        user.profileImage = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    // Optionally update other details if present in req.body
    const { userName, phone, address } = req.body;
    if (userName && userName.trim().length >= 3) {
        user.userName = userName.trim();
    }
    if (phone && phone.trim().length === 10) {
        user.phone = phone.trim();
    }
    if (address && address.trim().length > 0) {
        user.address = address.trim();
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

const updatePassword = asyncHandler(async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword) {
        throw new ApiError("Please provide both new password and confirm password.", 400);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError("User not found.", 404);
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError("New password and confirm password do not match.", 400);
    }

    if (newPassword.length < 8) {
        throw new ApiError("New password must be at least 8 characters long.", 400);
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});

export { registerUser, loginUser, getUser, logoutUser, fetchLeaderBoard, updateProfile, updatePassword }