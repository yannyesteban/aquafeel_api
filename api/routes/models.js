const express = require("express");
const passport = require("passport");
const router = express.Router();
const modelController = require("../controllers/models");

//router.post("/orders", orderController.createOrder);
router.get("/list", modelController.list);
router.post("/add", modelController.add);
router.post("/edit", modelController.edit);
router.delete("/delete", modelController.delete);


module.exports = router;
