const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: {
    type: String,
    default: '/images/placeholder.png',
    trim: true,
  },
});

module.exports = mongoose.model('Product', productSchema);