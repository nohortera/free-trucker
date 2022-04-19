const Router = require('express');
const router = new Router();
const controller = require('../controllers/loadController');
const authMiddleware = require('../middlewares/authMiddleware');



router.get('/', authMiddleware, controller.getLoads);
router.post('/', authMiddleware, controller.addLoad)
router.get('/active', authMiddleware, controller.getActiveLoad)
router.patch('/active/state', authMiddleware, controller.updateLoadStateById)
router.get('/:id', authMiddleware, controller.getLoadById)
router.put('/:id', authMiddleware, controller.updateLoadById)
router.delete('/:id', authMiddleware, controller.deleteLoadById)
router.post('/:id/post', authMiddleware, controller.postLoadById)
router.get('/:id/shipping_info', authMiddleware, controller.getShippingInfoById)



module.exports = router;
