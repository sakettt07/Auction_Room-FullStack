import express from 'express';
import { registerUser } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/signup').post(registerUser);

export default router;