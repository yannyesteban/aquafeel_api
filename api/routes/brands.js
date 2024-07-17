const express = require("express");
const passport = require("passport");
const router = express.Router();
const brandController = require("../controllers/brand");

//router.post("/orders", orderController.createOrder);
router.get("/list", brandController.list);
router.post("/add", brandController.add);
router.post("/edit", brandController.edit);
router.delete("/delete", brandController.delete);


module.exports = router;
