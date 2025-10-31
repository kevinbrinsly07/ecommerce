const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);

module.exports = router;