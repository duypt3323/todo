const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageUserSchema = new Schema(
  {
    imageUrl: String,
    userId: mongoose.Types.ObjectId,
  },
  { timestamps: true }
);

const ImageUser = mongoose.model("ImageUser", imageUserSchema);

module.exports = ImageUser;
