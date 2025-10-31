const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);