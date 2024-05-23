const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leads2');
const passport = require("passport");

router.post('/add',leadsController.add);
router.get('/get',leadsController.list);
router.delete('/delete',leadsController.delete);
router.post('/edit',leadsController.edit);
router.get('/details',leadsController.details);
router.post('/get-by-status',leadsController.listByStatus);
router.post('/get-by-month',leadsController.listByMonth);
router.post('/bulk-status-update',leadsController.bulkStatusUpdate);
router.get('/list-all',passport.authenticate("jwt", { session: false }),leadsController.listAll);
router.get('/search',leadsController.search);
router.get('/filter',leadsController.filter);
router.post('/add-bulk',leadsController.addBulk);
router.post('/delete-bulk',leadsController.deleteBulk);
router.post('/bulk-assign-seller',leadsController.bulkAssignToSeller);
router.get('/import-leads-from-csv',leadsController.importLeadsFromCSV);
router.get('/appointments',leadsController.listAppointments);

module.exports = router;
