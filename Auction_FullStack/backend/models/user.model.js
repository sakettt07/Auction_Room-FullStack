import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    minLength: [3, "Username must contain at least 3 characters."],
    maxLength: [40, "Username cannot exceed 40 characters."],
  },
  password: {
    type: String,
    selected: false,
    minLength: [8, "Password must contain at least 8 characters."],
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
    minLength: [10, "Phone Number must contain exact 10 digits."],
    maxLength: [10, "Phone Number must contain exact 10 digits."],
  },
  profileImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  paymentMethods: {
    bankTransfer: {
      bankAccountNumber: String,
      bankAccountName: String,
      bankName: String,
    },
    stripe: {
      stripeEmail:String,
    },
    paypal: {
      paypalEmail: String,
    },
  },
  role: {
    type: String,
    enum: ["Auctioneer", "Bidder", "Admin"],
  },
  unpaidCommission: {
    type: Number,
    default: 0,
  },
  auctionsWon: {
    type: Number,
    default: 0,
  },
  moneySpent: {
    type: Number,
    default: 0,
  },
},{timestamps:true});

// before saving the user lets hash the password

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
// when the user enters its password it will match the exisiting for the login purposes
userSchema.methods.comparepassword=async function(password){
  return await bcrypt.compare(password, this.password);
}

//a token will be generated when the user will be loggged in

userSchema.methods.generateToken=function(){
  return jwt.sign({id:this._id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES_IN});
}

// a middleware function will be added to check if the user is authenticated

export const User = mongoose.model("User", userSchema);
