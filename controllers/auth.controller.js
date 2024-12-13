import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { generateOtp, sendEmail } from "../utils/mailer.js";

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let otp = null;
    let isVerified = false;

    if (role !== "seller") {
      otp = generateOtp();
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar,
      role,
      otp,
      isVerified,
      wallet: { balance: 0, transactions: [] },
    });

    await user.save();

    if (role !== "seller") {
      const subject = "Your OTP Code";
      const htmlContent = `<p>Your OTP code is <strong>${otp}</strong>. Please use this code to verify your account.</p>`;
      await sendEmail(email, subject, htmlContent);
    }

    return res.status(201).json({
      message:
        role === "seller"
          ? "Seller registered successfully, waiting for admin verification."
          : "User registered successfully, check your mail.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isVerified = true;
    user.otp = null;
    await user.save();
    res
      .status(200)
      .json({ message: "User verified successfully. You can now log in." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Wrong email or password" });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your account before logging in." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong email or password" });
    }
    const token = generateToken(user._id, user.role, res);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("access-token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendOtpForReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = generateOtp();
    user.otp = otp;
    await user.save();
    const subject = "Your OTP Code";
    const htmlContent = `<p>Your OTP code is <strong>${otp}</strong>. Please use this code to reset your password.</p>`;
    await sendEmail(email, subject, htmlContent);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  register,
  verifyOtp,
  login,
  logout,
  sendOtpForReset,
  verifyResetOtp,
  resetPassword,
};
