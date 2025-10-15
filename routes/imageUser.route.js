const express = require("express");
const upload = require("../uploads");
const ImageUserController = require("../controllers/imageUser.controller");

const imageUserRoute = express.Router();

imageUserRoute.post("", upload.upload.single("image"), ImageUserController.add);
imageUserRoute.get("/:id", ImageUserController.get);
imageUserRoute.get("", ImageUserController.list);
imageUserRoute.delete("/:id", ImageUserController.destroy);

module.exports = imageUserRoute;
