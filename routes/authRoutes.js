import express from 'express'
import { forgotPasswordController, loginController, signUpController } from '../controllers/authController.js';
import { verifyUser } from '../middleWares/authMiddleWare.js';

const router = express.Router();

router.post('/signup',signUpController);

router.post('/login',loginController);

router.post('/reset-password',forgotPasswordController);

export default router;