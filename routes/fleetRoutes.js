import express from "express";
import multer from "multer";
import {
  registerFleet,
  loginFleet,
  getAllFleets,
  getFleetById,
  deleteFleet,
  approveFleet,
  rejectFleet,
} from "../controllers/fleetController.js";

const router = express.Router();

// Multer configuration
const upload = multer({
  dest: "uploads/",
  limits: {
    files: 50,
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|webp|pdf|csv|xlsx|xls/;
    const extname = allowedExtensions.test(file.originalname.toLowerCase());
    
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'application/pdf',
      'text/csv',
      'application/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    
    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      console.log("❌ File rejected:", file.originalname, file.mimetype);
      cb(new Error("Only images, PDFs, CSV and Excel files allowed"));
    }
  },
});

// Fleet routes
router.post("/register", upload.any(), registerFleet);
router.post("/login", loginFleet);

// Admin routes
router.get("/admin", getAllFleets);
router.get("/admin/:id", getFleetById);
router.patch("/admin/:id/approve", approveFleet);
router.patch("/admin/:id/reject", rejectFleet);
router.delete("/admin/:id", deleteFleet);

export default router;