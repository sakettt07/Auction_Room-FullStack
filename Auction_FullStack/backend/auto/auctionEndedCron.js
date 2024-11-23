import cron from 'node-cron';
import { Auction } from "../models/auction.model.js";
import { calculateCommision } from '../controllers/commission.controller.js';;
import { Bid } from '../models/bid.model.js'
import { sendEmail } from '../utils/sendEmailFunc.js';
import ApiError from"../middlewares/error.middleware.js";

const auctionEnded = () => {
    cron.schedule("*/1 * * * *", async () => {
        const date = new Date();
        const auctionEnds = await Auction.find({
            endTime: { $lt: date },
            commissionCalc: false,
        })
        for (const auction of auctionEnds) {
            try {
                const commissionAmt = await calculateCommision(auction._id);
                auction.commissionCalc = true;
                const highestBidder = await Bid.findOne({
                    auctionItem: auction._id,
                    amount: auction.currentPrice,
                });
                const auctioneer = await User.findById(auction.createdBy);
                auctioneer.unpaidCommission = commissionAmt;
                if (highestBidder) {
                    auctioneer.highestBidder = highestBidder.bidder.id;
                    await auction.save();
                    const bidder = await User.findById(highestBidder.bidder.id);
                    const highestBidAmt = bidder.moneySpent + highestBidder.amount;
                    await User.findByIdAndUpdate(bidder._id, {
                        $inc: {
                            moneySpent: highestBidder.amount,
                            auctionsWon: 1
                        },
                    },
                        { new: true }
                    );
                    await User.findByIdAndUpdate(auctioneer._id, {
                        $inc: {
                            unpaidCommission: commissionAmt
                        }
                    }, { new: true });
                    const subject = `Congratulations!! You Have won the auction for ${auction.title}`;
                    const message = `Dear ${bidder.userName}, \n\nCongratulations! You have won the auction for ${auction.title}. \n\nBefore proceeding for payment contact your auctioneer via your auctioneer email:${auctioneer.email} \n\nPlease complete your payment using one of the following methods:\n\n1. **Bank Transfer**: \n- Account Name: ${auctioneer.paymentMethods.bankTransfer.bankAccountName} \n- Account Number: ${auctioneer.paymentMethods.bankTransfer.bankAccountNumber} \n- Bank: ${auctioneer.paymentMethods.bankTransfer.bankName}\n\n2. **PhonePe**:\n- You can send payment via PhonePe: ${auctioneer.paymentMethods.stripe.stripeEmail}\n\n3. **PayPal**:\n- Send payment to: ${auctioneer.paymentMethods.paypal.paypalEmail}\n\n4. **Cash on Delivery (COD)**:\n- If you prefer COD, you must pay 20% of the total amount upfront before delivery.\n- To pay the 20% upfront, use any of the above methods.\n- The remaining 80% will be paid upon delivery.\n- If you want to see the condition of your auction item then send your email on this: ${auctioneer.email}\n\nPlease ensure your payment is completed by [Payment Due Date]. Once we confirm the payment, the item will be shipped to you.\n\nThank you for participating!\n\nBest regards,\n Team Auction Walaa`;
                    console.log("SENDING EMAIL TO HIGHEST BIDDER");
                    sendEmail({email:bidder.email, subject, message})
                    console.log("SUCCESSFULLY EMAIL SEND TO HIGHEST BIDDER");
                }
                else{
                    await auctioneer.save();
                }
            } catch (error) {
                throw new ApiError(error.message|| "Some error in the ended auction cron",400);
            }
        }
    })
}
export { auctionEnded };