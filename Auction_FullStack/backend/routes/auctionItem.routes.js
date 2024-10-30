import express from 'express';
import { addNewAuctionItem } from '../controllers/auctionItem.controller.js';
const router=express.Router();

router.route('/createAuction',addNewAuctionItem);

export default router;
