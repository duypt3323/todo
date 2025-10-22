const mongoose = require("mongoose");
const { Schema } = mongoose;
const ImageUser = require("./imageUser.model");

const userSchema = new Schema(
  {
    email: String,
    password: String,
    fullname: String,
  },
  { timestamps: true }
);

userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getFilter());
    if (user) {
      console.log("Delete images");
      await ImageUser.deleteMany({ userId: user._id });
    }

    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
