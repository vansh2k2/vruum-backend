import express from "express";
import multer from "multer";
import {
  registerPartner,
  loginPartner,
  getAllPartners,
  getPartnerById,
  deletePartner,
  approvePartner,
  rejectPartner,
} from "../controllers/partnerController.js";

const router = express.Router();

/* =========================
   MULTER CONFIG
========================= */
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

/* =========================
   PARTNER ROUTES
========================= */

// 🔹 Register Partner
router.post("/register", uploadFields, registerPartner);

// 🔹 Login Partner
router.post("/login", loginPartner);

// 🔹 Admin – get all partners
router.get("/admin", getAllPartners);

// 🔹 Admin – get single partner
router.get("/admin/:id", getPartnerById);

// 🔹 Admin – approve partner
router.patch("/admin/:id/approve", approvePartner);

// 🔹 Admin – reject partner
router.patch("/admin/:id/reject", rejectPartner);

// 🔹 Admin – delete partner
router.delete("/admin/:id", deletePartner);

export default router;
