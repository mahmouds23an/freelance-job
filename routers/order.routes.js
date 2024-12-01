import express from "express";

import {
  placeOrder,
  getUserOrders,
  getSellerOrders,
} from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/auth.mw.js";

const router = express.Router();

router.post("/place-order", authMiddleware, placeOrder);
router.get("/user-orders", getUserOrders);
router.get("/seller-orders", getSellerOrders);

export default router;
