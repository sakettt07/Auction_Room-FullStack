import cron from 'node-cron';
import { User } from '../models/user.model.js';
import { Paymentproof } from '../models/commissionProof.model.js';
import { sendEmail } from "../utils/sendEmailFunc.js";
import ApiError from '../middlewares/error.middleware.js';

const verifyCommission = () => {
    cron.schedule("*/1 * * * *", async () => {
        console.log("Running verify comiision cron.");
        const approvedProofs = await Paymentproof.find({ status: 'Approved' });
        for (const paymentProofSchema of approvedProofs) {
            try {
                const user = await User.findById(paymentProofSchema.userId);
                let updatedUserData = {};
                if (user) {
                    if (user.unpaidCommission >= paymentProofSchema.amount) {
                        updatedUserData = await User.findByIdAndUpdate(user._id, {
                            $inc: {
                                moneySpent: paymentProofSchema.amount,
                                unpaidCommission: -paymentProofSchema.amount
                            }
                        }, { new: true })
                        await Paymentproof.findByIdAndUpdate(paymentProofSchema._id, {
                            status: "Settled",
                        })
                    }
                    else {
                        updatedUserData = await User.findByIdAndUpdate(user._id, {
                            unpaidCommission: 0
                        }, { new: true })
                        await Paymentproof.findByIdAndUpdate(paymentProofSchema._id, {
                            status: "Settled",
                        })
                    }
                    await Commission.create({
                        amount: paymentProofSchema.amount,
                        user: user._id,
                    });
                    const settleDate = new Date(Date.now()).toString().substring(0, 15);
                    const subject = `Your Payment has been successfully verified and settled`;
                    const message = `Dear ${user.userName},\n\nWe are pleased to inform you that your recent payment has been successfully verified and settled. Thank you for promptly providing the necessary proof of payment. Your account has been updated, and you can now proceed with your activities on our platform without any restrictions.\n\nPayment Details:\nAmount Settled: ${paymentProofSchema.amount}\nUnpaid Amount: ${updatedUserData.unpaidCommission}\nDate of Settlement: ${settleDate}\n\nBest regards,\nZeeshu Auction Team`;
                    sendEmail({ email: user.email, subject, message });
                }
                console.log(`User ${paymentProofSchema.userId} paid commission of ${paymentProofSchema.amount}`)
            } catch (error) {
                throw new ApiError(error.message || `error in processing the commission proof of user :${paymentProofSchema.userId}`, 400)
            }
        }
    })

}
export { verifyCommission };