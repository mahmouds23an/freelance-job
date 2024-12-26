import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const { origin } = req.headers;
    const buyerId = req.userId;

    const orderData = {
      items,
      buyer: buyerId,
      payment: false,
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          image: [item.image[0]],
          file: item.fileUrl,
        },
        unit_amount: item.price * 100,
      },
    }));

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    return res.status(200).json({ success: true, url: session.url });
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
