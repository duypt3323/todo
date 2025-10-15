const mongoose = require("mongoose");

async function connnectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("Connect DB successfully");
  } catch (error) {
    console.log("Falied to connect the DB, error: ", error);
  }
}

module.exports = connnectDB;
