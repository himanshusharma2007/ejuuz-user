const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../temp"));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-name-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Max size: 10 MB
    fileFilter
});

module.exports = upload;