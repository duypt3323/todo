const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Please login" });
    }

    req.currentUser = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }

  next();
};

module.exports = verifyUser;
