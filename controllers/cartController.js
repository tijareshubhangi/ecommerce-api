import Cart from "../models/Cart.js"
import Product from "../models/Product.js"

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    res.json(cart || { userId: req.user._id, items: [] });
  } catch (err) {
    next(err);
  }
};

export const addOrUpdateItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (quantity <= 0) return res.status(400).json({ message: 'Quantity must be > 0' });

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [{ productId, quantity }] });
      return res.status(201).json(cart);
    }

    const idx = cart.items.findIndex(it => it.productId.equals(productId));
    if (idx > -1) cart.items[idx].quantity = quantity;
    else cart.items.push({ productId, quantity });

    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(it => !it.productId.equals(productId));
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};