const express = require('express');
const router = express.Router();
const profilesController = require('../controllers/profile');
const uploadMiddleware = require('../middleware/uploads');
const passport = require("passport");

router.get('/get',profilesController.get);
router.post('/edit',profilesController.edit);
router.post('/edit-email',profilesController.editEmail);
router.put('/set-location', passport.authenticate("jwt", { session: false }), profilesController.setLocation);
router.post('/upload-avatar', passport.authenticate("jwt", { session: false }), uploadMiddleware.upload, profilesController.uploadAvatar);
module.exports = router;
