const Router = require('express');
const router = new Router();
const controller = require('../controllers/truckController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/', authMiddleware, controller.getTrucks);
router.post('/', authMiddleware, controller.addTruck);
router.get('/:id', authMiddleware, controller.getTruckById);
router.put('/:id', authMiddleware, controller.updateTruckById);
router.delete('/:id', authMiddleware, controller.deleteTruckById);
router.post('/:id/assign', authMiddleware, controller.assignTruckById);



module.exports = router;
