const model = require("../models/user.model");

const getDetail = async (req, res) => {
  try {
    const currentUser = await model.findOne({ _id: req.currentUser.id });

    if (!currentUser) {
      return res.status(404).json({ msg: "User is not found" });
    }

    return res.status(200).json({ data: currentUser });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const filter = {};

    const users = await model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await model.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      data: users,
      pagination: { total, page, limit, totalPages },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getDetail,
  getAll,
};
