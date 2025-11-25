// backend/middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// ================================
// STORAGE FOLDER (if not exists)
// ================================
const uploadPath = "uploads/services";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ================================
// MULTER STORAGE
// ================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // uploads/services folder
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

// ================================
// FILE FILTER
// ================================
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed (jpg, png, webp, gif)!"));
  }
};

// ================================
// MULTER EXPORT
// ================================
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;
