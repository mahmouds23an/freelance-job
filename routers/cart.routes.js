import express from "express";

import {
  addToCart,
  getCart,
  removeItemFromCart,
} from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.mw.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/get", authMiddleware, getCart);
router.delete("/remove/:itemId", authMiddleware, removeItemFromCart);

export default router;
