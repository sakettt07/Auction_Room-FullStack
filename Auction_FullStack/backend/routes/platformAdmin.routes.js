import express from 'express';
import {deletePaymentproof,
    deleteAuctionItem,updateProofStatus,
    getPaymentproofs,
    getpaymentDetails,
    fetchAllUsers,
    monthlyRevenue
} from "../controllers/platformAdmin.controller.js";
import {checkRole,isAuthenticated,} from "../middlewares/auth.middleware.js";
const router=express.Router();

router.route('/removeitem/delete/:id').delete(isAuthenticated,checkRole("Admin"), deleteAuctionItem);
router.route('/removepaymentproof/delete/:id').delete(isAuthenticated,checkRole("Admin"),deletePaymentproof);

router.route('/paymentproofs/getall').get(isAuthenticated,checkRole("Admin"),getPaymentproofs);

router.route('/paymentproofdetail/:id').get(isAuthenticated,checkRole("Admin"),getpaymentDetails);
router.route('/payments/updateProofStatus/:id').put(isAuthenticated,checkRole("Admin"),updateProofStatus);
router.route('/sorteduser/getall').get(isAuthenticated,checkRole("Admin"),fetchAllUsers);
router.route('/revenuegenerated').get(isAuthenticated,checkRole("Admin"),monthlyRevenue)


export default router;