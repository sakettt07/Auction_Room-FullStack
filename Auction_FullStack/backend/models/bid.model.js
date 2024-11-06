import mongoose from "mongoose";
const bidSchema=new mongoose.Schema({
    bidder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    auction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Auction',
        required:true
    }
});
export const Bid=mongoose.model('Bid',bidSchema);