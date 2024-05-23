const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notifications2');
router.get('/list',notificationController.list);
router.post('/add',notificationController.add);
router.post('/edit',notificationController.edit);
router.delete('/delete',notificationController.delete);
module.exports = router;
