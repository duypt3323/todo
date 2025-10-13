require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const verifyUser = require("./middlewares/verifyUser.middleware");
const authRoute = require("./routes/auth.route");
const noteRoute = require("./routes/note.route");
const userRoute = require("./routes/user.route");
const imageUserRoute = require("./routes/imageUser.route");

const app = express();

app.use(express.json()); // Middleware to access res.body

connectDB();

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/notes", verifyUser, noteRoute);
app.use("/api/v1/users", verifyUser, userRoute);
app.use("/api/v1/user-images", verifyUser, imageUserRoute);

module.exports = app;
