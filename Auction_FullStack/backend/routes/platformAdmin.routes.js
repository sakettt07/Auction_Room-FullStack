import express from 'express';
import {
    deletePaymentproof,
    deleteAuctionItem, updateProofStatus,
    getPaymentproofs,
    getpaymentDetails,
    fetchAllUsers,
    monthlyRevenue
} from "../controllers/platformAdmin.controller.js";
import { checkRole, isAuthenticated, } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route('/removeitem/delete/:id').delete(isAuthenticated, checkRole("Super Admin"), deleteAuctionItem);
router.route('/removepaymentproof/delete/:id').delete(isAuthenticated, checkRole("Super Admin"), deletePaymentproof);

router.route('/paymentproofs/getall').get(isAuthenticated, checkRole("Super Admin"), getPaymentproofs);

router.route('/paymentproofdetail/:id').get(isAuthenticated, checkRole("Super Admin"), getpaymentDetails);
router.route('/payments/updateProofStatus/:id').put(isAuthenticated, checkRole("Super Admin"), updateProofStatus);
router.route('/sorteduser/getall').get(isAuthenticated, checkRole("Super Admin"), fetchAllUsers);
router.route('/revenuegenerated').get(isAuthenticated, checkRole("Super Admin"), monthlyRevenue)


export default router;