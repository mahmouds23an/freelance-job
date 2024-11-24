import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const ACCESS_TOKEN_EXPIRATION = "1d";

const generateToken = async (userId, role, res) => {
  const accessToken = jwt.sign(
    { _id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRATION }
  );

  let user;
  if (role === "admin") {
    user = await User.findById(userId);
  } else if (role === "seller") {
    user = await User.findById(userId);
  } else if (role === "user") {
    user = await User.findById(userId);
  }

  if (user) {
    user.accessToken = accessToken;
    await user.save();

    res.cookie("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  }
};

export default generateToken;
