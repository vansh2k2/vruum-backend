import express from "express";
import multer from "multer";
import {
  registerPartner,
  getAllPartners,
  getPartnerById,
  deletePartner,
  approvePartner,
  rejectPartner,
  loginPartner,   // ⭐ NEW IMPORT
} from "../controllers/partnerController.js";

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// All uploadable fields
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

// =============================
// ROUTES
// =============================

// Register partner
router.post("/register", uploadFields, registerPartner);

// ⭐ NEW — LOGIN ROUTE
router.post("/login", loginPartner);

// Get all partners (Admin)
router.get("/", getAllPartners);

// Get single partner
router.get("/:id", getPartnerById);

// Delete partner
router.delete("/:id", deletePartner);

// Approve partner
router.put("/approve/:id", approvePartner);

// Reject partner
router.put("/reject/:id", rejectPartner);

export default router;
