import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectCloudinary from "./utils/cloudinary.js";
import authRoutes from "./routers/auth.routes.js";
import productRoutes from "./routers/product.routes.js";
import categoriesAndSubCategoriesRoutes from "./routers/categoriesAndSub-categories.routes.js";
import cartRoutes from "./routers/cart.routes.js";
import userRoutes from "./routers/user.routes.js";
import orderRoutes from "./routers/order.routes.js";
import adminRoutes from "./routers/admin.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

connectCloudinary();
startServer();
