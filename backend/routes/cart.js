const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

router.use(auth);
router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);

module.exports = router;