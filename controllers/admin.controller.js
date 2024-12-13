import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { sendEmail } from "../utils/mailer.js";

const adminApprovePendingSeller = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { sellerId } = req.params;
    const seller = await User.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (seller.isVerified) {
      return res.status(400).json({ message: "Seller is already verified" });
    }
    seller.isVerified = true;
    await seller.save();
    const subject = "Good news";
    const htmlContent = `<p>Your account has been verified successfully</p>`;
    await sendEmail(seller.email, subject, htmlContent);
    return res.status(200).json({ message: "Seller verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const adminApprovePendingProduct = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { productId } = req.params;
    const product = await Product.findById(productId).populate(
      "seller",
      "email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.status === "approved") {
      return res.status(400).json({ message: "Product is already approved" });
    }
    product.status = "approved";
    await product.save();
    const subject = "Good news";
    const htmlContent = `<p>Your product has been verified successfully</p>`;
    await sendEmail(product.seller.email, subject, htmlContent);
    return res.status(200).json({ message: "Product verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const adminRefusePendingSeller = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { sellerId } = req.params;
    const seller = await User.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    const subject = "Bad news";
    const htmlContent = `<p>Your account has been removed</p>`;
    await sendEmail(seller.email, subject, htmlContent);

    await User.findByIdAndDelete(sellerId);
    return res
      .status(200)
      .json({ message: "Seller account removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const adminRefusePendingProduct = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { productId } = req.params;
    const product = await Product.findById(productId).populate(
      "seller",
      "email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.status = "rejected";
    await Product.findByIdAndDelete(productId);
    const subject = "Bad news";
    const htmlContent = `<p>Your product has been removed</p>`;
    await sendEmail(product.seller.email, subject, htmlContent);
    return res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPendingSellers = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const sellers = await User.find({
      isVerified: false,
      role: "seller",
    }).select(
      "-password -wallet -avatar -role -favorites -purchasedProducts -otp -isVerified -createdAt -updatedAt -__v"
    );
    return res.status(200).json({ count: sellers.length, sellers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPendingProducts = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const products = await Product.find({ status: "pending" }).select(
      "-status -reviews -createdAt -updatedAt -__v"
    );
    return res.status(200).json({ count: products.length, products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  adminApprovePendingProduct,
  adminApprovePendingSeller,
  adminRefusePendingSeller,
  adminRefusePendingProduct,
  getPendingSellers,
  getPendingProducts,
};
