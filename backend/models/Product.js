const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  brand: String,
  sku: String,
  stock: Number,
  weight: String,
  dimensions: String,
  warranty: String,
  origin: String,
  shipping: { type: String, default: 'Free' },
  returns: { type: String, default: '30 days' },
  image: {
    type: String,
    default: '/images/placeholder.png',
    trim: true,
  },
});

module.exports = mongoose.model('Product', productSchema);