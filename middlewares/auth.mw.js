import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const authMiddleware = async (req, res, next) => {
  const token =
    req.cookies["access-token"] ||
    (req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new mongoose.Types.ObjectId(decoded._id);

    const user = await User.findById(decoded._id);
    if (!user || user.role !== decoded.role) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    req.userId = decoded._id;
    req.role = decoded.role;
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default authMiddleware;
