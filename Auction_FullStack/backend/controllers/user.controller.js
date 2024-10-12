import ApiError from "../middlewares/error.middleware.js";
import {User} from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser=asyncHandler(async(req,res)=>{

    // fetching the image files first.

})
const loginUser=asyncHandler(async(req,res)=>{

})
export {registerUser,loginUser}