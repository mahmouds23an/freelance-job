import express from "express";

import {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.mw.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/get", authMiddleware, getCart);
router.put("/update/:id", authMiddleware, updateCartItem);
router.delete("/delete/:id", authMiddleware, deleteCartItem);

export default router;
