const express = require('express');
const router = express.Router();

const { getProducts, getProductById, getProductSuggestions } = require('../controllers/productController');


router.get('/suggestions/search', getProductSuggestions);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;