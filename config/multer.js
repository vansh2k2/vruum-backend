import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImage = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const allowedVideo = ["video/mp4", "video/webm"];

  if (allowedImage.includes(file.mimetype) || allowedVideo.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

export default upload;
