import express from "express";

import {
  createPromoCode,
  getPromoCodes,
  updatePromoCode,
  deletePromoCode,
  getSellerPromoCodes,
} from "../controllers/promoCode.controller.js";
import authMiddleware from "../middlewares/auth.mw.js";

const router = express.Router();

router.post("/create", authMiddleware, createPromoCode);
router.get("/get", authMiddleware, getPromoCodes);
router.put("/update", authMiddleware, updatePromoCode);
router.delete("/delete/:id", authMiddleware, deletePromoCode);
router.get("/get-seller-promo-codes", authMiddleware, getSellerPromoCodes);

export default router;
