import express from "express";

import {
  register,
  verifyOtp,
  login,
  logout,
  sendOtpForReset,
  verifyResetOtp,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-otp-for-reset", sendOtpForReset);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

export default router;
