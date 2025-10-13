const express = require("express");
const userController = require("../controllers/user.controller");

const userRoute = express.Router();

userRoute.get("/me", userController.getDetail);
userRoute.get("", userController.getAll);

module.exports = userRoute;
