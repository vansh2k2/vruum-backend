// backend/routes/serviceRoutes.js
import express from "express";
import {
  getServices,
  getAllServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

// yaha apna auth middleware import karo agar hai
// import { protectAdmin } from "../middleware/authMiddleware.js";
// import upload from "../middleware/uploadMiddleware.js"; // multer config

const router = express.Router();

// USER SIDE
router.get("/", getServices);

// ADMIN SIDE
// yaha pe protectAdmin + upload.single("image") laga sakte ho
router.get("/admin", /*protectAdmin,*/ getAllServices);
router.post(
  "/admin",
  /*protectAdmin, upload.single("image"),*/ 
  createService
);
router.put(
  "/admin/:id",
  /*protectAdmin, upload.single("image"),*/ 
  updateService
);
router.delete("/admin/:id", /*protectAdmin,*/ deleteService);

export default router;
