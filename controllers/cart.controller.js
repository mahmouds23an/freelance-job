import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (quantity) item.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Cart item updated", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1)
      return res.status(404).json({ message: "Item not found" });

    cart.items.splice(itemIndex, 1);

    await cart.save();
    res.status(200).json({ message: "Cart item deleted", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addToCart, getCart, updateCartItem, deleteCartItem };
