import express from 'express';
import { checkRole, isAuthenticated } from '../middlewares/auth.middleware.js';
import { placebid } from '../controllers/bid.controller.js';
const router= express.Router();

router.route('/bid/:id',isAuthenticated,checkRole('Bidder'),placebid)


export default router;