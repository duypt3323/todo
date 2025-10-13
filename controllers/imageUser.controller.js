const upload = require("../uploads");
const model = require("../models/imageUser.model");

const add = async (req, res) => {
  try {
    const doc = model({
      imageUrl: req.file.filename,
      userId: req.currentUser.id,
    });

    await doc.save();

    return res.status(201).json({ data: doc });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const get = async (req, res) => {
  try {
    const image = await model.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!image) {
      return res.status(404).json({ msg: "Image is not found" });
    }

    return res.status(200).json({ data: image });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const filter = { userId: req.currentUser.id };

    const images = await model
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: images });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const image = await model.findByIdAndDelete({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!image) {
      return res.status(404).json({ msg: "Image is not found" });
    }

    await upload.deleteImage(image.imageUrl);

    return res.status(200).json({ data: "Image was deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  add,
  get,
  list,
  destroy,
};
