const Product = require('../models/Product');


const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Suggestion endpoint for search autocomplete
const getProductSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") return res.json([]);
    const regex = new RegExp(q, "i");
    const suggestions = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
      ],
    })
      .limit(8)
      .select("_id name category image");
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProductById, getProductSuggestions };