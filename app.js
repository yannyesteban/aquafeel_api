const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
// Passport for jwt
var passport = require("passport");

//  for cors error handling
var cors = require("cors");

// check directory and create
let directory = path.join(__dirname, "/uploads");
console.log(directory);

/* ============================================================== */
/* passport config */
require("./api/middleware/passport")(passport);
app.use(passport.initialize());

if (!fs.existsSync(directory)) fs.mkdirSync(directory);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    console.log(`file ==== ${JSON.stringify(file)}`);
    cb(null, Date.now() + "-" + file.originalname.toString());
  },
});

const upload = multer({ storage: storage });

// const upload =  multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '/uploads/');
//     },

// })
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload.any());

mongoose.connect(process.env.DATABASE_URL);

const rolesRoutes = require("./api/routes/roles");
const authRoutes = require("./api/routes/auth");
const userRoutes = require("./api/routes/user");
const statusRoutes = require("./api/routes/status");
const profileRoutes = require("./api/routes/profile");
const leadRoutes = require("./api/routes/leads");
const routeRoutes = require("./api/routes/routes");
const resourceRoutes = require("./api/routes/resource");
const statsRoutes = require("./api/routes/stats");
const notificationRoutes = require("./api/routes/notifications");
const orderRoutes = require("./api/routes/orders");
const brandRoutes = require("./api/routes/brands");
const modelRoutes = require("./api/routes/models");
const creditRoutes = require("./api/routes/credit");
const creditCardRoutes = require("./api/routes/creditcard");

app.use("/roles", rolesRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/status", statusRoutes);
app.use("/profile", profileRoutes);
app.use("/leads", leadRoutes);
app.use("/routes", routeRoutes);
app.use("/resources", resourceRoutes);
app.use("/stats", statsRoutes);
app.use("/notifications", notificationRoutes);
app.use("/orders", orderRoutes);
app.use("/brands", brandRoutes);
app.use("/models", modelRoutes);
app.use("/credit", creditRoutes);
app.use("/creditcard", creditCardRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.options("*", cors());

module.exports = app;
