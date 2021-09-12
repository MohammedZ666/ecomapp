const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/place-order', orderController.place_order);
router.post('/update-status', orderController.update_status)
router.get('/get-orders', orderController.get_orders)
module.exports = router;