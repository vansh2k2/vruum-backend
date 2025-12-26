// routes/ambulanceRoutes.js
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

// Admin routes - ✅ YEH CHANGE KARO
router.get("/", getAllAmbulances);
router.get("/admin/:id", getAmbulanceById);           // ✅ /admin prefix add kiya
router.patch("/admin/:id/approve", approveAmbulance);  // ✅ /admin prefix add kiya
router.patch("/admin/:id/reject", rejectAmbulance);    // ✅ /admin prefix add kiya
router.patch("/admin/:id/status", updateAmbulanceStatus); // ✅ /admin prefix add kiya
router.delete("/admin/:id", deleteAmbulance);          // ✅ /admin prefix add kiya

export default router;