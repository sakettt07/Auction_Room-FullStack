import cron from 'nodecron';
import { User } from '../models/user.model.js';
import {Commission} from "../models/commission.model.js";

const verifyCommission=()=>{
    cron.schedule("*/1 * * * *", async()=>{
        const users=await User.find({verified:false}).exec();
        for(let user of users){
            const commission=new Commission({user:user._id});
            await commission.save();
            user.verified=true;
            await user.save();
            console.log(`Commission generated for user ${user.name}`);
        }
    })

}
export{verifyCommission};