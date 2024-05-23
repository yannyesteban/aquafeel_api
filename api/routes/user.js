
const express = require('express');
const router = express.Router();
const passport = require("passport");
const usersController = require('../controllers/user');

router.get('/list',usersController.list);
router.post('/add',usersController.add);
router.put('/edit',usersController.edit);
router.delete('/delete',usersController.delete);
router.post('/block',usersController.block);
router.get('/details',usersController.details);
router.get('/list-all-sellers', passport.authenticate("jwt", { session: false }), usersController.listAllSellers);
router.get('/get-leads-count',usersController.getLeadsCount);
router.delete('/delete-all-record',usersController.deleteAllRecord);
router.delete('/reassign-and-delete',usersController.reassignAndDelete);


module.exports = router;
