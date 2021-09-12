const { Router } = require('express');
const authController = require('../controllers/authController')

const router = Router();

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.post('/update-user', authController.update_user)
router.get('/logout', authController.logout_get)
router.post('/forgot-password', authController.forgot_password)
router.post('/reset-password', authController.reset_password)
module.exports = router;