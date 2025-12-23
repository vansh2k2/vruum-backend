import express from "express";
import multer from "multer";
import {
  registerAmbulance,
  loginAmbulance,
  getAllAmbulances,
  getAmbulanceById,
  deleteAmbulance,
  approveAmbulance,
  rejectAmbulance,
  updateAmbulanceStatus,
} from "../controllers/ambulanceController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Ambulance registration with multiple file uploads
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
router.post("/register", uploadFields, registerAmbulance);
router.post("/login", loginAmbulance);

// Admin routes
router.get("/admin", getAllAmbulances);
router.get("/admin/:id", getAmbulanceById);
router.patch("/admin/:id/approve", approveAmbulance);
router.patch("/admin/:id/reject", rejectAmbulance);
router.patch("/admin/:id/status", updateAmbulanceStatus);
router.delete("/admin/:id", deleteAmbulance);

export default router;