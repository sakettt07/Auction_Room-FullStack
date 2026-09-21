import ApiError from "../middlewares/error.middleware.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendNewUserEmail } from "../utils/sendNewUserEmail.js";
import { sendEmail } from "../utils/sendEmailFunc.js";
import { encryptPassword, decryptPassword } from "../utils/crypto.utils.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";


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
        passwordBackup: encryptPassword(password),
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
    user.passwordBackup = encryptPassword(newPassword);
    await user.save();

    res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});

// Request OTP for password reset/recovery
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError("Please enter your registered email address.", 400);
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: { $regex: new RegExp(`^${trimmedEmail}$`, "i") } });

    if (!user) {
        throw new ApiError("No account found with this email address.", 404);
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Valid for 10 minutes
    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // HTML Email Template
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
        .container { max-width: 520px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #d97706, #f59e0b); padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; }
        .content { padding: 32px 24px; }
        .code-box { background: #0f172a; border: 2px dashed #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .code { font-size: 36px; font-weight: 800; color: #fbbf24; letter-spacing: 8px; font-family: monospace; }
        .notice { font-size: 13px; color: #94a3b8; line-height: 1.6; margin-top: 20px; }
        .footer { border-top: 1px solid #334155; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Auction Space Recovery</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin: 0 0 12px; color: #e2e8f0;">Hello <strong>${user.userName || "User"}</strong>,</p>
          <p style="font-size: 14px; margin: 0 0 20px; color: #cbd5e1; line-height: 1.6;">
            We received a request to recover or reset the password for your Auction Space account. Use the 6-digit verification code below to proceed:
          </p>
          <div class="code-box">
            <div class="code">${otp}</div>
            <p style="margin: 8px 0 0; font-size: 12px; color: #94a3b8;">Valid for 10 minutes</p>
          </div>
          <div class="notice">
            <p style="margin: 0 0 8px;">After entering this code, you will be able to either:</p>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>View your current old password</strong> directly</li>
              <li><strong>Set a brand new password</strong> for your account</li>
            </ul>
            <p style="margin: 12px 0 0; color: #ef4444;">If you did not request this, please ignore this email. Your account remains completely secure.</p>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Auction Space. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: "Your 6-Digit Password Recovery Code - Auction Space",
            message: `Your Auction Space 6-digit recovery code is: ${otp}. It will expire in 10 minutes.`,
            html,
        });
        res.status(200).json(new ApiResponse(200, { email: user.email }, "6-digit verification code sent to your email."));
    } catch (emailError) {
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpire = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ApiError("Failed to send verification email. Please check SMTP settings or try again.", 500);
    }
});

// Verify 6-digit OTP and return short-lived reset token
const verifyResetOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new ApiError("Email and 6-digit verification code are required.", 400);
    }

    const trimmedEmail = email.trim().toLowerCase();
    const hashedOtp = crypto.createHash("sha256").update(otp.trim()).digest("hex");

    const user = await User.findOne({
        email: { $regex: new RegExp(`^${trimmedEmail}$`, "i") },
        resetPasswordOtp: hashedOtp,
        resetPasswordOtpExpire: { $gt: Date.now() },
    }).select("+passwordBackup");

    if (!user) {
        throw new ApiError("Invalid or expired 6-digit verification code.", 400);
    }

    // Generate signed reset session token (15 mins)
    const resetToken = jwt.sign(
        { userId: user._id, email: user.email, purpose: "password_reset" },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    // Clear OTP so it cannot be reused
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(
            200,
            {
                resetToken,
                hasOldPassword: Boolean(user.passwordBackup),
                userName: user.userName,
                email: user.email,
            },
            "Code verified successfully. Please choose your option."
        )
    );
});

// Option 1: Reveal old password
const revealOldPassword = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const resetToken = req.body.resetToken || tokenFromHeader;

    if (!resetToken) {
        throw new ApiError("Missing verification session token.", 401);
    }

    let decoded;
    try {
        decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
        throw new ApiError("Verification session expired or invalid. Please request a new code.", 401);
    }

    if (decoded.purpose !== "password_reset") {
        throw new ApiError("Invalid token purpose.", 401);
    }

    const user = await User.findById(decoded.userId).select("+passwordBackup");
    if (!user) {
        throw new ApiError("User not found.", 404);
    }

    if (!user.passwordBackup) {
        throw new ApiError(
            "Old password cannot be decrypted because this account was created before password recovery was enabled. Please use 'Create a new one' instead.",
            400
        );
    }

    const decryptedPassword = decryptPassword(user.passwordBackup);
    if (!decryptedPassword) {
        throw new ApiError("Unable to retrieve old password securely. Please reset your password instead.", 500);
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { oldPassword: decryptedPassword, userName: user.userName, email: user.email },
            "Old password retrieved successfully."
        )
    );
});

// Option 2: Reset password to a new one
const resetPasswordWithCode = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const { resetToken = tokenFromHeader, newPassword, confirmPassword } = req.body;

    if (!resetToken) {
        throw new ApiError("Missing verification session token.", 401);
    }

    if (!newPassword || !confirmPassword) {
        throw new ApiError("Please enter both new password and confirm password.", 400);
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError("Passwords do not match.", 400);
    }

    if (newPassword.length < 8) {
        throw new ApiError("Password must contain at least 8 characters.", 400);
    }

    let decoded;
    try {
        decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
        throw new ApiError("Verification session expired or invalid. Please request a new code.", 401);
    }

    if (decoded.purpose !== "password_reset") {
        throw new ApiError("Invalid token purpose.", 401);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new ApiError("User not found.", 404);
    }

    user.password = newPassword;
    user.passwordBackup = encryptPassword(newPassword);
    await user.save();

    res.status(200).json(
        new ApiResponse(200, { email: user.email }, "Password has been successfully reset! You can now login.")
    );
});

export {
    registerUser,
    loginUser,
    getUser,
    logoutUser,
    fetchLeaderBoard,
    updateProfile,
    updatePassword,
    forgotPassword,
    verifyResetOtp,
    revealOldPassword,
    resetPasswordWithCode
};