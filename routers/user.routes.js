import express from "express";

import {
  currentUser,
  editProfile,
  changePassword,
  changeAvatar,
  removeAvatar,
  userDeleteHisAccount,
  userBecomeASeller,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.mw.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get("/current-user", authMiddleware, currentUser);
router.put("/edit-profile", authMiddleware, editProfile);
router.put("/change-password", authMiddleware, changePassword);
router.put(
  "/change-avatar",
  upload.single("avatar"),
  authMiddleware,
  changeAvatar
);
router.delete("/remove-avatar", authMiddleware, removeAvatar);
router.delete("/delete-account", authMiddleware, userDeleteHisAccount);
router.put("/become-a-seller", authMiddleware, userBecomeASeller);

export default router;
