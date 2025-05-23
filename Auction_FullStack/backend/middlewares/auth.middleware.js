import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "./error.middleware.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies.token;
        if (!token) {
            throw new ApiError("Not authenticated, please login.", 400)
        }
        // now verify the token using the verify method
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id).select("-password")
        if (!user) {
            throw new ApiError("Not authenticated, please login.", 400);

        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError("Not authenticated, please login.", 400)
    }
})

// the below middleware basically checks whether the user is authorised to access the auciton page or not.

export const checkRole=(...roles)=>{
    return asyncHandler(async(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            throw new ApiError(` ${req.user.role} don't have permission to access this resource.`, 403);
        }
        next();
    })
}
