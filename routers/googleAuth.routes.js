import express from "express";
import passport from "../utils/googleAuth.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// Redirect to Google for authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    // Generate a token for the user
    const token = generateToken(req.user._id, req.user.role, res);

    // Redirect to your frontend with the token (e.g., React app)
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

export default router;
