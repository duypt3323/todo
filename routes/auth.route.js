const express = require("express");
const authController = require("../controllers/auth.controller");

const userRoute = express.Router();

userRoute.post("/signup", authController.signup);
userRoute.post("/signin", authController.signin);

module.exports = userRoute;
