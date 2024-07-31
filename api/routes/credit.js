const express = require("express");
const passport = require("passport");
const router = express.Router();
const creditController = require("../controllers/credit");

//router.post("/orders", orderController.createOrder);
router.get("/list", creditController.list);
router.post("/add", creditController.add);
router.post("/edit", creditController.edit);
router.delete("/delete", creditController.delete);

router.get("/get", creditController.details);
router.get("/details", creditController.details);

router.get("/pdf", creditController.pdf);

module.exports = router;
