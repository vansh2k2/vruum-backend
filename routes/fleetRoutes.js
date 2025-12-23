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

/* =====================================================
   MULTER CONFIG (IMPORTANT FIX)
===================================================== */

// ⚠️ upload.any() use kar rahe hain
// kyunki fleet me dynamic vehicle files aati hain
// jaise: fleetVehicle_rc_0, fleetVehicle_insurance_1 etc.

const upload = multer({
  dest: "uploads/",
  limits: {
    files: 50, // fleet me multiple vehicles + documents
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
});

/* =====================================================
   FLEET ROUTES
===================================================== */

// 🔹 Fleet Registration (MAIN FIX HERE)
router.post(
  "/register",
  upload.any(),          // 🔥 IMPORTANT (Unexpected field fix)
  registerFleet
);

// 🔹 Fleet Login
router.post("/login", loginFleet);

// 🔹 Admin – get all fleets
router.get("/admin", getAllFleets);

// 🔹 Admin – get single fleet with vehicles
router.get("/admin/:id", getFleetById);

// 🔹 Admin – approve fleet
router.patch("/admin/:id/approve", approveFleet);

// 🔹 Admin – reject fleet
router.patch("/admin/:id/reject", rejectFleet);

// 🔹 Admin – delete fleet
router.delete("/admin/:id", deleteFleet);

export default router;
