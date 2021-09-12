const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/create', productController.product_create_get);
router.get('/', productController.product_index);
router.post('/create', productController.product_create_post);
router.get('/:id', productController.product_details);
router.post('/comment/:product_id', productController.post_comment)
router.post('/comment/delete/:product_id', productController.delete_comment)
router.post('/comment/edit/:product_id', productController.edit_comment)
router.delete('/:id', productController.product_delete);

module.exports = router;