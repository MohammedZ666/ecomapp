const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/:id', cartController.create_cart)

module.exports = router;