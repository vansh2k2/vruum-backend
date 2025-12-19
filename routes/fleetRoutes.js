// routes/fleetRoutes.js
// =======================================================
// FLEET ROUTES
// =======================================================

import express from "express";
import multer from "multer";

import {
  registerFleet,
  loginFleet,
  getAllFleets,
  getFleetById,
  approveFleet,
  rejectFleet,
  deleteFleet,
} from "../controllers/fleetController.js";

const router = express.Router();

// =======================================================
// MULTER CONFIG
// =======================================================
const upload = multer({ dest: "uploads/" });

// =======================================================
// ALL UPLOADABLE FIELDS (MATCH FRONTEND EXACTLY)
// =======================================================
const uploadFields = upload.fields([
  { name: "profilePhoto", maxCount: 1 },

  // Common documents
  { name: "aadharFront", maxCount: 1 },
  { name: "aadharBack", maxCount: 1 },
  { name: "dlFront", maxCount: 1 },
  { name: "dlBack", maxCount: 1 },
  { name: "policeClearance", maxCount: 1 },

  // Fleet specific
  { name: "fleetDriversListFile", maxCount: 1 },

  // Dynamic fleet vehicle files (handled by keys)
  // fleetVehicle_rc_0, fleetVehicle_insurance_0, etc.
]);

// =======================================================
// ROUTES
// =======================================================

// REGISTER FLEET
router.post("/register", uploadFields, registerFleet);

// LOGIN FLEET
router.post("/login", loginFleet);

// GET ALL FLEETS (ADMIN)
router.get("/", getAllFleets);

// GET SINGLE FLEET
router.get("/:id", getFleetById);

// APPROVE FLEET (ADMIN)
router.put("/approve/:id", approveFleet);

// REJECT FLEET (ADMIN)
router.put("/reject/:id", rejectFleet);

// DELETE FLEET (ADMIN)
router.delete("/:id", deleteFleet);

export default router;
