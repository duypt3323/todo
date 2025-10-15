const mailer = require("../mailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("../models/user.model");

const signup = async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    const userByEmail = await model.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ msg: "The email is already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const doc = new model({ email, password: hashedPassword, fullname });
    await doc.save();

    const accessToken = jwt.sign(
      {
        id: doc._id,
        email: doc.email,
        fullname: doc.fullname,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    mailer();

    return res.status(201).json({
      data: doc,
      access_token: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userByEmail = await model.findOne({ email });
    if (!userByEmail) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatchedPassword = await bcrypt.compare(
      password,
      userByEmail.password
    );
    if (!isMatchedPassword) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        id: userByEmail._id,
        email: userByEmail.email,
        fullname: userByEmail.fullname,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      access_token: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  signup,
  signin,
};
