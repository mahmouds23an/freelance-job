import express from "express";

import {
  addCategory,
  editCategory,
  deleteCategory,
  getCategories,
  addSubCategory,
  editSubCategory,
  deleteSubCategory,
  getSubCategories,
} from "../controllers/categoriesAndSub.controller.js";
import authMiddleware from "../middlewares/auth.mw.js";

const router = express.Router();

// Categories
router.post("/add-category", authMiddleware, addCategory);
router.put("/edit-category/:id", authMiddleware, editCategory);
router.delete("/delete-category/:id", authMiddleware, deleteCategory);
router.get("/get-categories", getCategories);

// Sub-categories
router.post("/add-sub-category", authMiddleware, addSubCategory);
router.put("/edit-sub-category/:id", authMiddleware, editSubCategory);
router.delete("/delete-sub-category/:id", authMiddleware, deleteSubCategory);
router.get("/get-sub-categories", getSubCategories);

export default router;
