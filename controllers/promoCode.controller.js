import User from "../models/user.model.js";
import PromoCode from "../models/promoCode.model.js";

const createPromoCode = async (req, res) => {
  if (req.role !== "seller") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { code, discount, endDate } = req.body;
    const seller = req.userId;
    const user = await User.findById(seller);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newPromoCode = new PromoCode({ code, discount, endDate, seller });
    await newPromoCode.save();
    return res.status(201).json({ message: "Promo code created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPromoCodes = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
   
    const promoCodes = await PromoCode.find().populate(
      "seller",
      "firstName lastName"
    );
    return res.status(200).json(promoCodes);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updatePromoCode = async (req, res) => {
  if (req.role !== "seller") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const seller = req.userId;
    const { code, discount, endDate, isActive, id } = req.body;
    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }
    if (promoCode.seller._id.toString() !== seller) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (code) promoCode.code = code;
    if (discount) promoCode.discount = discount;
    if (endDate) promoCode.endDate = endDate;
    if (isActive) promoCode.isActive = isActive;
    await promoCode.save();
    return res.status(200).json({ message: "Promo code updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deletePromoCode = async (req, res) => {
  if (req.role !== "seller") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const seller = req.userId;
    const { id } = req.params;
    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }
    if (promoCode.seller._id.toString() !== seller) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await PromoCode.findByIdAndDelete(id);
    return res.status(200).json({ message: "Promo code deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSellerPromoCodes = async (req, res) => {
  if (req.role !== "seller") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const seller = req.userId;
    const user = await User.findById(seller);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const promoCodes = await PromoCode.find({ seller })
    return res.status(200).json(promoCodes);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createPromoCode,
  getPromoCodes,
  updatePromoCode,
  deletePromoCode,
  getSellerPromoCodes,
};
