// backend/routes/serviceRoutes.js
import express from "express";
import {
  getServices,
  getAllServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import upload from "../middleware/uploadMiddleware.js"; 
// agar admin auth lagana ho to yaha import karo
// import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER SIDE
router.get("/", getServices);

// ADMIN SIDE
router.get("/admin", getAllServices);

router.post(
  "/admin",
  upload.single("image"),   // ← IMAGE + FORM DATA YAHI SE AAYEGA
  createService
);

router.put(
  "/admin/:id",
  upload.single("image"),   // ← EDIT bhi image support karega
  updateService
);

router.delete("/admin/:id", deleteService);

export default router;
