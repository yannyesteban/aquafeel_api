const express = require('express');
const router = express.Router();
const routesController = require('../controllers/routes');

router.get('/list',routesController.list);
router.post('/add',routesController.add);
router.post('/edit',routesController.edit);
router.delete('/delete',routesController.delete);
router.get('/details',routesController.details);

module.exports = router;