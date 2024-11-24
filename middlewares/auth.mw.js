import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  const token =
    req.cookies["access-token"] ||
    (req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({ error: "لا تستطيع الوصول لهذه الصفحة" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.message === "jwt expired") {
          return res.status(401).json({ error: "تم انتهاء الصلاحية" });
        }
        return res.status(401).json({ error: err.message });
      }

      req.userId = decoded._id;
      req.role = decoded.role;

      if (decoded.role === "admin") {
        const admin = await User.findById(decoded.id);
        if (!admin) {
          return res
            .status(401)
            .json({ error: "لا تستطيع الوصول لهذه الصفحة" });
        }
      } else if (decoded.role === "seller") {
        const seller = await User.findById(decoded.id);
        if (!seller) {
          return res
            .status(401)
            .json({ error: "لا تستطيع الوصول لهذه الصفحة" });
        }
      } else if (decoded.role === "user") {
        const user = await User.findById(decoded.id);
        if (!user) {
          return res
            .status(401)
            .json({ error: "لا تستطيع الوصول لهذه الصفحة" });
        }
      }

      next();
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default authMiddleware;
