import express from "express";
import passport from "../utils/googleAuth.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// Success route
router.get("/login/success", (req, res) => {
  if (req.user) {
    generateToken(req.user._id, req.user.role, res);
    return res.status(200).json({
      error: false,
      message: "Login successful",
      user: req.user,
    });
  } else {
    return res.status(403).json({
      error: true,
      message: "Not authorized",
    });
  }
});

// failed route
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Login failed",
  });
});

// Redirect to Google for authentication
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

// Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

export default router;
