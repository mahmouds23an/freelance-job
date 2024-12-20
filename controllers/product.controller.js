import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { SubCategory } from "../models/catAndSubCat.model.js";

const addProduct = async (req, res) => {
  if (req.role !== "seller") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { name, description, price, subCategory } = req.body;

    const seller = req.userId;

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const existingSubCategory = await SubCategory.findById(subCategory);
    if (!existingSubCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    // Process image uploads
    const images = [
      req.files.image1 && req.files.image1[0],
      req.files.image2 && req.files.image2[0],
      req.files.image3 && req.files.image3[0],
      req.files.image4 && req.files.image4[0],
    ].filter(Boolean);

    const imageUrls = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    let fileUrl = null;
    if (req.files.file && req.files.file[0]) {
      const result = await cloudinary.uploader.upload(req.files.file[0].path, {
        resource_type: "raw",
      });
      fileUrl = result.secure_url;
    }

    const newProduct = new Product({
      name,
      description,
      price,
      subCategory,
      seller,
      fileUrl,
      image: imageUrls,
    });

    await newProduct.save();

    return res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" });
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    if (products.length === 0) {
      return res.status(200).json({ message: "No products found" });
    }
    return res.status(200).json({ count: products.length, products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  if (req.role !== "user") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { productId, rate, comment } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingReview = product.reviews.find(
      (review) => review.user.userId.toString() === userId.toString()
    );

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const newReview = {
      user: { userId, userName: `${user.firstName}` },
      rate,
      comment,
    };

    product.reviews.push(newReview);
    await product.save();

    return res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editReview = async (req, res) => {
  if (req.role !== "user") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { productId, rate, comment } = req.body;
    const userId = req.userId;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.find(
      (r) => r.user.userId.toString() === userId.toString()
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.rate = rate;
    review.comment = comment;
    await product.save();

    return res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { productId } = req.params;
    const userId = req.userId;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const reviewIndex = product.reviews.findIndex(
      (r) => r.user.userId.toString() === userId.toString()
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found" });
    }

    product.reviews.splice(reviewIndex, 1);
    await product.save();

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate(
      "reviews.user.userId",
      "reviews.user.firstName"
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json(product.reviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSellerProductsById = async (req, res) => {
  try {
    const seller = req.userId;
    const products = await Product.find({ seller });
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    if (products.length === 0) {
      return res.status(200).json({ message: "No products found" });
    }
    return res.status(200).json({ count: products.length, products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  addProduct,
  getProducts,
  addReview,
  editReview,
  deleteReview,
  getProductReviews,
  getSellerProductsById,
};
