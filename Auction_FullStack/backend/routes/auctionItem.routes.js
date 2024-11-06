import express from 'express';
import { addNewAuctionItem, getAllItems,getAuctionDetails,myAuctionItem,removeItem, republishItem } from '../controllers/auctionItem.controller.js';
import { checkRole, isAuthenticated } from '../middlewares/auth.middleware.js';
import { trackCommission } from '../middlewares/trackCommission.middleware.js';
const router=express.Router();

// we will be using a middleware for the authentication that only a auctioner can post the item in the auction.
router.route('/createauction').post(isAuthenticated, checkRole("Auctioneer"), trackCommission, addNewAuctionItem);
router.route('/auctionitems').get(isAuthenticated,getAllItems);
router.route('/removeItem/:id').delete(isAuthenticated,checkRole("Auctioneer"),removeItem);
router.route('/auction/:id').get(isAuthenticated,getAuctionDetails);
router.route('/myauction').get(isAuthenticated,checkRole("Auctioneer"),myAuctionItem);
router.route('/republishauction/:id').put(isAuthenticated,checkRole("Auctioneer"),republishItem);

export default router;
