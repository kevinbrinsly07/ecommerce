// ...existing code...
const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// Delete product (admin only)
router.delete('/products/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all pending orders (admin only)
router.get('/orders/pending', auth, requireRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' }).populate('user').populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Example: dashboard stats (admin only)
router.get('/stats', auth, requireRole('admin'), async (req, res) => {
  const [products, ordersPending, ordersToday] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
  ]);
  res.json({ products, ordersPending, ordersToday });
});

// Example: create product (admin only)
router.post('/products', auth, requireRole('admin'), upload.single('image'), async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    // Collect all product fields from the request body
    const {
      name,
      price,
      description,
      category,
      brand,
      sku,
      stock,
      weight,
      dimensions,
      warranty,
      origin,
      shipping,
      returns
    } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : undefined;
    // Helper to handle empty strings as undefined
    function clean(val) {
      return val === '' ? undefined : val;
    }

    const productData = {
      name: clean(name),
      price: price !== undefined && price !== '' ? Number(price) : undefined,
      description: clean(description),
      category: clean(category),
      brand: clean(brand),
      sku: clean(sku),
      stock: stock !== undefined && stock !== '' ? Number(stock) : undefined,
      weight: clean(weight),
      dimensions: clean(dimensions),
      warranty: clean(warranty),
      origin: clean(origin),
      shipping: clean(shipping),
      returns: clean(returns)
    };
    if (image) productData.image = image;
    const p = await Product.create(productData);
    res.json(p);
  } catch (err) {
    console.error('Product creation error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Approve pending order (admin only)
router.post('/orders/:id/approve', auth, requireRole('admin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'pending') return res.status(400).json({ message: 'Order is not pending' });
    order.status = 'approved';
    await order.save();
    res.json({ message: 'Order approved', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// Stripe payment session (cart checkout)
const stripe = require('../config/stripe');
router.post('/stripe/checkout', auth, requireRole('user'), async (req, res) => {
  try {
    // Get cart items from request body
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items to checkout' });
    }
    // Format line items for Stripe
    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:5173/orders',
      cancel_url: 'http://localhost:5173/cart',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all users (admin only)
router.get('/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ username: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a user (admin only)
router.delete('/users/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change user role (admin only)
router.put('/users/:id/role', auth, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = role;
    await user.save();
    res.json({ message: 'Role updated', user: { _id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});