const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles');

router.get('/list',rolesController.list);
router.post('/add',rolesController.add);
router.put('/edit',rolesController.edit);
router.delete('/delete',rolesController.delete);

module.exports = router;
