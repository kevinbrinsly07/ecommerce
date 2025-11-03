const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

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
    const { name, price, description } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : undefined;
    const productData = { name, price, description };
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