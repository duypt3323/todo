const model = require("../models/note.model");

const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;

    const doc = model({ title, description, userId: req.currentUser.id });
    await doc.save();

    return res.status(201).json({ data: doc });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getNote = async (req, res) => {
  try {
    const note = await model.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!note) {
      return res.status(404).json({ msg: "Note is not found" });
    }

    return res.status(200).json({ data: note });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const gettAllNote = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const filter = { userId: req.currentUser.id };

    const notes = await model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await model.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      data: notes,
      pagination: { total, page, limit, totalPages },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await model.findByIdAndUpdate(
      { _id: req.params.id, userId: req.currentUser.id },
      req.body
    );

    if (!note) {
      return res.status(404).json({ msg: "Note is not found" });
    }

    return res.status(200).json({ msg: "Note was updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await model.findOneAndDelete({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!note) {
      return res.status(404).json({ msg: "Note is not found" });
    }

    return res.status(200).json({ msg: "Note was deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createNote,
  getNote,
  gettAllNote,
  updateNote,
  deleteNote,
};
