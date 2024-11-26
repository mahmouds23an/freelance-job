import express from "express";

import { addProduct, getProducts } from "../controllers/product.controller.js";
import upload from "../middlewares/multer.js";
import authMiddleware from "../middlewares/auth.mw.js";

const router = express.Router();

router.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  authMiddleware,
  addProduct
);
router.get("/get", getProducts);

export default router;
