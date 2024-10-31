import express from 'express';
import { addNewAuctionItem } from '../controllers/auctionItem.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
const router=express.Router();

// we will be using a middleware for the authentication that only a auctioner can post the item in the auction.
router.route('/createAuction').post(isAuthenticated, addNewAuctionItem);

export default router;
