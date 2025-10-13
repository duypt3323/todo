const express = require("express");
const noteController = require("../controllers/note.controller");

const noteRoute = express.Router();

noteRoute.post("", noteController.createNote);
noteRoute.get("/:id", noteController.getNote);
noteRoute.get("", noteController.gettAllNote);
noteRoute.put("/:id", noteController.updateNote);
noteRoute.delete("/:id", noteController.deleteNote);

module.exports = noteRoute;
