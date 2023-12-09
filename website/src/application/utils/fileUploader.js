const path = require('path');
const multer = require('multer');
const AppError = require('../utils/appError.js');

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new AppError('Unsupported file format.', 400), false);
  }
}

module.exports = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});