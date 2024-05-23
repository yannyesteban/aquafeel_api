const express = require('express');
const router = express.Router();
const statusController = require('../controllers/status');
const uploadMiddleware = require('../middleware/uploads');

router.get('/list',statusController.list);
router.post('/add',uploadMiddleware.upload,statusController.add);
router.post('/edit',uploadMiddleware.upload,statusController.edit);
router.put('/enable',statusController.enable);
router.delete('/delete',statusController.delete);


module.exports = router;
