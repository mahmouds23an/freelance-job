import express from "express";

import {
  addTitle,
  editTitle,
  deleteTitle,
  getTitles,
  addCategory,
  editCategory,
  deleteCategory,
  getCategories,
  addSubCategory,
  editSubCategory,
  deleteSubCategory,
  getSubCategories,
  getServiceByPath,
} from "../controllers/categoriesAndSub.controller.js";
import authMiddleware from "../middlewares/auth.mw.js";

const router = express.Router();

// Titles
router.post("/add-title", authMiddleware, addTitle);
router.put("/edit-title/:id", authMiddleware, editTitle);
router.delete("/delete-title/:id", authMiddleware, deleteTitle);
router.get("/get-titles", getTitles);

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

// Services
router.get("/:titleName/:categoryName/:subCategoryName", getServiceByPath);

export default router;
