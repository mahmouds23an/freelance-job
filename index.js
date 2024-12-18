import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";

import connectCloudinary from "./utils/cloudinary.js";
import authRoutes from "./routers/auth.routes.js";
import productRoutes from "./routers/product.routes.js";
import categoriesAndSubCategoriesRoutes from "./routers/categoriesAndSub-categories.routes.js";
import cartRoutes from "./routers/cart.routes.js";
import userRoutes from "./routers/user.routes.js";
import orderRoutes from "./routers/order.routes.js";
import adminRoutes from "./routers/admin.routes.js";
import googleAuthRoutes from "./routers/googleAuth.routes.js";
import PromoCodeRoutes from "./routers/promoCode.routes.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "your-secret-key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(googleAuthRoutes);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGO_URL}/freelance-project`
    );
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error`);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoriesAndSubCategoriesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/google", googleAuthRoutes);
app.use("/api/promo", PromoCodeRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

connectCloudinary();
startServer();
