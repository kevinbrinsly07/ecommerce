const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    await order.populate('items.product');
    res.json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { checkout, getOrders };