const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads";
    const uploadDir = path.join(__dirname, "./tmp", uploadPath);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const deleteImage = async (fileName) => {
  const uploadPath = "uploads";
  const uploadDir = path.join(__dirname, "./tmp", uploadPath, fileName);

  await fs.unlink(uploadDir);
};

module.exports = {
  upload,
  deleteImage,
};
