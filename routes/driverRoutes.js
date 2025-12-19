import express from "express";
import multer from "multer";
import {
  registerDriver,
  loginDriver,
  getAllDrivers,
  approveDriver,
  rejectDriver,
} from "../controllers/driverController.js";

const router = express.Router();

// Multer
const upload = multer({ dest: "uploads/" });

const uploadFields = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "aadharFront", maxCount: 1 },
  { name: "aadharBack", maxCount: 1 },
  { name: "dlFront", maxCount: 1 },
  { name: "dlBack", maxCount: 1 },
  { name: "policeClearance", maxCount: 1 },
]);

// =============================
// ROUTES
// =============================

// REGISTER DRIVER
router.post("/register", uploadFields, registerDriver);

// LOGIN DRIVER
router.post("/login", loginDriver);

// ADMIN
router.get("/", getAllDrivers);
router.put("/approve/:id", approveDriver);
router.put("/reject/:id", rejectDriver);

export default router;
