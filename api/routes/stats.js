const express = require('express');
const passport = require("passport");
const router = express.Router();
const statsController = require('../controllers/stats');
router.get('/list', passport.authenticate("jwt", { session: false }), statsController.list);
module.exports = router;
