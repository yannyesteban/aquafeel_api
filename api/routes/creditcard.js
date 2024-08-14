const express = require("express");
const passport = require("passport");
const router = express.Router();
const creditCardController = require("../controllers/creditcard");

//router.post("/orders", orderController.createOrder);
router.get("/list", creditCardController.list);
router.post("/add", creditCardController.add);
router.post("/edit", creditCardController.edit);
router.delete("/delete", creditCardController.delete);

router.get("/get", creditCardController.details);
router.get("/details", creditCardController.details);

router.get("/pdf", creditCardController.pdf);

module.exports = router;
