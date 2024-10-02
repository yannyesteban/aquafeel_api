const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/leadResource');
const uploadMiddleware = require('../middleware/uploads');
const passport = require("passport");

router.get('/list', resourcesController.list);
//router.get('/get',resourcesController.get);
router.delete('/delete',resourcesController.delete);
router.post('/edit', passport.authenticate("jwt", { session: false }), uploadMiddleware.upload, resourcesController.edit);
router.post('/editdata', passport.authenticate("jwt", { session: false }),resourcesController.edit);
router.post('/add', passport.authenticate("jwt", { session: false }), uploadMiddleware.upload, resourcesController.addResource);
module.exports = router;
