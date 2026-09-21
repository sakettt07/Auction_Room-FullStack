import express from 'express';
import {
    loginUser,
    registerUser,
    getUser,
    logoutUser,
    fetchLeaderBoard,
    updateProfile,
    updatePassword,
    forgotPassword,
    verifyResetOtp,
    revealOldPassword,
    resetPasswordWithCode
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/signup').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(isAuthenticated, getUser);
router.route('/update/profile').put(isAuthenticated, updateProfile).post(isAuthenticated, updateProfile);
router.route('/password/update').put(isAuthenticated, updatePassword);
router.route('/change/password').put(isAuthenticated, updatePassword);
router.route('/logout').post(isAuthenticated, logoutUser);
router.get("/leaderboard", fetchLeaderBoard);

// Forgot Password Flow
router.post('/password/forgot', forgotPassword);
router.post('/password/verify-code', verifyResetOtp);
router.post('/password/reveal-old', revealOldPassword);
router.post('/password/reset-new', resetPasswordWithCode);

export default router;