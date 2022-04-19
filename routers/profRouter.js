const Router = require('express');
const router = new Router();
const controller = require('../controllers/profController');
const authMidleware = require('../middlewares/authMiddleware');


router.get('/me', authMidleware, controller.getProfileInfo);

router.delete('/me', authMidleware, controller.deleteProfile);

router.patch('/me/password', authMidleware, controller.changePassword);


module.exports = router;
