import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routers/auth.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

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

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
