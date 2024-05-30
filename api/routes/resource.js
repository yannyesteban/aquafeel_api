const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resource');
const uploadMiddleware = require('../middleware/uploads');
const passport = require("passport");

router.get('/list', resourcesController.list);
//router.get('/get',resourcesController.get);
router.delete('/delete',resourcesController.delete);
router.post('/edit', passport.authenticate("jwt", { session: false }), uploadMiddleware.uploadPDF, resourcesController.edit);
router.post('/editdata', passport.authenticate("jwt", { session: false }),resourcesController.edit);
router.post('/add', passport.authenticate("jwt", { session: false }), uploadMiddleware.uploadPDF, resourcesController.addResource);
module.exports = router;
