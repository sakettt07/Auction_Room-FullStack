// only for the approved paymentss
import mongoose from 'mongoose';
const commissionSchema= new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
},{
    timestamps:true
});

export const Commission=mongoose.model('Commission',commissionSchema);