import express from "express";
import multer from "multer";
import {
  registerHearse,
  loginHearse,
  getAllHearses,
  getHearseById,
  deleteHearse,
  approveHearse,
  rejectHearse,
  updateHearseStatus,
} from "../controllers/hearseController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Hearse registration with multiple file uploads
const uploadFields = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "vehiclePicture", maxCount: 1 },
  { name: "aadharFront", maxCount: 1 },
  { name: "aadharBack", maxCount: 1 },
  { name: "dlFront", maxCount: 1 },
  { name: "dlBack", maxCount: 1 },
  { name: "policeClearance", maxCount: 1 },
  { name: "rcCertificate", maxCount: 1 },
  { name: "fitnessCertificate", maxCount: 1 },
  { name: "pollutionCertificate", maxCount: 1 },
  { name: "insuranceCertificate", maxCount: 1 },
]);

// Public routes
router.post("/register", uploadFields, registerHearse);
router.post("/login", loginHearse);

// Admin routes
router.get("/admin", getAllHearses);
router.get("/admin/:id", getHearseById);
router.patch("/admin/:id/approve", approveHearse);
router.patch("/admin/:id/reject", rejectHearse);
router.patch("/admin/:id/status", updateHearseStatus);
router.delete("/admin/:id", deleteHearse);

export default router;