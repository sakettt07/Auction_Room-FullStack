import express from 'express';
import { loginUser, registerUser, getUser, logoutUser, fetchLeaderBoard } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/signup').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(isAuthenticated, getUser);
router.route('/logout').post(isAuthenticated, logoutUser);
router.get("/leaderboard", fetchLeaderBoard);


export default router;