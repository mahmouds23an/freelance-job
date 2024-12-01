import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    const { productId, paymentMethod, stripeToken } = req.body;
    const buyerId = req.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Service not found" });
    }

    const buyer = await User.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    if (buyer.purchasedProducts.includes(productId)) {
      return res
        .status(400)
        .json({ message: "You cannot purchase a product you already own" });
    }

    if (String(product.seller) === String(buyerId)) {
      return res
        .status(400)
        .json({ message: "You cannot buy your own service" });
    }

    let paymentStatus = "pending";
    let transactionId = null;

    if (paymentMethod === "wallet") {
      if (buyer.wallet.balance < product.price) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      buyer.wallet.balance -= product.price;
      buyer.wallet.transactions.push({
        type: "debit",
        amount: product.price,
        description: `Payment for service: ${product.name}`,
      });
      paymentStatus = "completed";
      await buyer.save();
    } else if (paymentMethod === "credit") {
      if (!stripeToken) {
        return res.status(400).json({
          message: "Stripe token is required for credit card payment",
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: product.price * 100,
        currency: "usd",
        payment_method_types: ["card"],
        description: `Payment for service: ${product.name}`,
        payment_method_data: { type: "card", token: stripeToken },
        confirm: true,
      });

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Stripe payment failed" });
      }

      transactionId = paymentIntent.id;
      paymentStatus = "completed";
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const newOrder = new Order({
      buyer: buyerId,
      seller: product.seller,
      product: productId,
      paymentStatus,
      transactionId,
    });

    await newOrder.save();

    buyer.purchasedProducts.push(productId);
    await buyer.save();

    return res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ buyer: userId })
      .populate("product", "name price fileUrl")
      .populate("seller", "firstName lastName");

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.userId;

    const orders = await Order.find({ seller: sellerId })
      .populate("product", "name price fileUrl")
      .populate("buyer", "firstName lastName");

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { placeOrder, getUserOrders, getSellerOrders };
