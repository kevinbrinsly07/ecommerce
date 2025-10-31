const express = require('express');
const router = express.Router();
const { checkout, getOrders } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);
router.post('/checkout', checkout);
router.get('/', getOrders);

module.exports = router;