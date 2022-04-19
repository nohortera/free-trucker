const Router = require('express');
const router = new Router();
const controller = require('../controllers/authController');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/forgot_password', controller.forgotPassword)

module.exports = router;
