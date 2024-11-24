import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar,
      role,
      wallet: { balance: 0, transactions: [] },
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await generateToken(user._id, user.role, res);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { register, login };
