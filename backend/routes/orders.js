const express = require('express');
const router = express.Router();
const { checkout, getOrders } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.use(auth);
router.post('/checkout', checkout);
router.get('/', getOrders);

module.exports = router;