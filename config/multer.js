import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImages = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const allowedVideos = ["video/mp4", "video/webm"];

  if (allowedImages.includes(file.mimetype) || allowedVideos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

export default upload;
