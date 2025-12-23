import express from "express";
import multer from "multer";
import {
  registerSarthi,
  loginSarthi,
  getAllSarthis,
  getSarthiById,
  deleteSarthi,
  approveSarthi,
  rejectSarthi,
} from "../controllers/sarthiController.js";

const router = express.Router();

/* =====================================================
   MULTER CONFIG (ONLY REQUIRED FIELDS FOR SARTHI)
   SARTHI = Driver WITHOUT vehicle
===================================================== */
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/* =====================================================
   ALLOWED FILE FIELDS (STRICT)
===================================================== */
const uploadFields = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "aadharFront", maxCount: 1 },
  { name: "aadharBack", maxCount: 1 },
  { name: "dlFront", maxCount: 1 },
  { name: "dlBack", maxCount: 1 },
  { name: "policeClearance", maxCount: 1 }, // optional
]);

/* =====================================================
   ROUTES
===================================================== */

// 🚖 SARTHI REGISTRATION
router.post("/register", uploadFields, registerSarthi);

// 🔐 SARTHI LOGIN
router.post("/login", loginSarthi);

// 🧑‍💼 ADMIN – GET ALL SARTHIS
router.get("/admin", getAllSarthis);

// 🧑‍💼 ADMIN – GET SINGLE SARTHI
router.get("/admin/:id", getSarthiById);

// ✅ ADMIN – APPROVE SARTHI
router.patch("/admin/:id/approve", approveSarthi);

// ❌ ADMIN – REJECT SARTHI
router.patch("/admin/:id/reject", rejectSarthi);

// 🗑️ ADMIN – DELETE SARTHI
router.delete("/admin/:id", deleteSarthi);

export default router;
