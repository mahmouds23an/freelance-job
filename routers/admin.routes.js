import express from "express";

import {
  adminApprovePendingSeller,
  adminApprovePendingProduct,
  adminRefusePendingSeller,
  adminRefusePendingProduct,
  getPendingSellers,
  getPendingProducts,
  allUsers,
  adminDeleteUser
} from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.mw.js";

const router = express.Router();

router.post("/approve-seller/:sellerId", authMiddleware, adminApprovePendingSeller);
router.post("/approve-product/:productId", authMiddleware, adminApprovePendingProduct);
router.post("/refuse-seller/:sellerId", authMiddleware, adminRefusePendingSeller);
router.post("/refuse-product/:productId", authMiddleware, adminRefusePendingProduct);
router.get("/pending-sellers", authMiddleware, getPendingSellers);
router.get("/pending-products", authMiddleware, getPendingProducts);
router.get("/all-users", authMiddleware, allUsers);
router.delete("/delete-user/:userId", authMiddleware, adminDeleteUser);

export default router;
