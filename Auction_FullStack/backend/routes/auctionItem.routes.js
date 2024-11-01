import express from 'express';
import { addNewAuctionItem } from '../controllers/auctionItem.controller.js';
import { checkRole, isAuthenticated } from '../middlewares/auth.middleware.js';
const router=express.Router();

// we will be using a middleware for the authentication that only a auctioner can post the item in the auction.
router.route('/createAuction').post(isAuthenticated, checkRole("Auctioneer"), addNewAuctionItem);

export default router;
