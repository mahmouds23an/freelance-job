import express from "express";

import {
  addProduct,
  getProducts,
  editProduct,
  deleteProduct,
  addReview,
  editReview,
  deleteReview,
  getProductReviews,
  getSellerProducts,
  getSellerProductsById,
} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.js";
import authMiddleware from "../middlewares/auth.mw.js";

const router = express.Router();

// Products
router.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  authMiddleware,
  addProduct
);
router.get("/get", getProducts);
router.put("/edit/:productId", authMiddleware, editProduct);
router.delete("/delete/:productId", authMiddleware, deleteProduct);

// Reviews
router.post("/add-review", authMiddleware, addReview);
router.put("/edit-review", authMiddleware, editReview);
router.delete("/delete-review/:productId", authMiddleware, deleteReview);
router.get("/get-reviews/:productId", getProductReviews);

// Seller Products
router.get("/get-seller-products", authMiddleware, getSellerProducts);
router.get("/get-seller-approved-products/:sellerId", getSellerProductsById);

export default router;
