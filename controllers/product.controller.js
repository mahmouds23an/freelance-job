import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.model.js";

const addProduct = async (req, res) => {
  if (req.role !== "seller") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const {
      name,
      description,
      price,
      category,
      purchasableManyTimes,
      seller,
      status,
    } = req.body;

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
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
      category,
      purchasableManyTimes,
      seller,
      status,
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
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    if (products.length === 0) {
      return res.status(200).json({ message: "No products found" });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { addProduct, getProducts };
