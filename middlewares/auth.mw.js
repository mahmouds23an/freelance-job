import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

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
    req.userId = decoded._id;
    req.role = decoded.role;

    const user = await User.findById(decoded._id);
    if (!user || user.role !== decoded.role) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default authMiddleware;
