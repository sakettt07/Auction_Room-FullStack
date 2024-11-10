import mongoose from "mongoose";

const paymentProofSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    proofImage:{
        publicId:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    status:{
        type:String,
        default:'Pending',
        enum:['Pending','Approved','Rejected','Settled']
    },
    uploadedAt:{
        type:Date,
        default:Date.now
    },
    amount:{
        type:Number,
        required:true
    },
    comment:{
        type:String
    }
})
export const Paymentproof=mongoose.model('PaymentProof',paymentProofSchema);