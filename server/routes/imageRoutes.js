const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.get('/:id', imageController.get_image)

module.exports = router;