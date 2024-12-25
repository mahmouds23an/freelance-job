import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRATION = "1d";

const generateToken = async (userId, role, res) => {
  const accessToken = jwt.sign({ _id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });

  res.cookie("access-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
