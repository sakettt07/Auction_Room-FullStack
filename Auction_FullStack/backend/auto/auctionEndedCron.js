import cron from 'node-cron';
import {Auction} from "../models/auction.model.js";

const auctionEnded=()=>{
    cron.schedule("*/1 * * * *",async()=>{
        const date=new Date();
        console.log("Cron is running fine");
    })
}
export {auctionEnded};