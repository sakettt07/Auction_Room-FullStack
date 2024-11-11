import express from 'express';
import { checkRole, isAuthenticated } from '../middlewares/auth.middleware.js';
import { commissionProof } from '../controllers/commission.controller.js';
const router = express.Router();

router.route('/commissionproof').post(
    isAuthenticated, checkRole("Auctioneer"), commissionProof)
export default router;
