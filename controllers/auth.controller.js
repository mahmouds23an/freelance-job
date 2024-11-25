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
    const otp = generateOtp();
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar,
      role,
      otp,
      wallet: { balance: 0, transactions: [] },
    });
    await user.save();
    const subject = "Your OTP Code";
    const htmlContent = `<p>Your OTP code is <strong>${otp}</strong>. Please use this code to verify your account.</p>`;
    await sendEmail(email, subject, htmlContent);
    res
      .status(201)
      .json({ message: "User registered successfully, Check your mail" });
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
    const token = generateToken(user._id);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { register, verifyOtp, login };
