const express = require("express");
const passport = require("passport");
const router = express.Router();
const orderController = require("../controllers/orders");

//router.post("/orders", orderController.createOrder);
router.get("/list", orderController.list);
router.post("/add", orderController.add);
router.post("/edit", orderController.edit);
router.delete("/delete", orderController.delete);

router.get("/get", orderController.details);
router.get("/details", orderController.details);

router.get("/pdf", orderController.pdf);

module.exports = router;
