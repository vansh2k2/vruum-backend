import express from "express";
import {
  createCarousel,
  getAllCarousel,
  getActiveCarousel,
  updateCarousel,
  deleteCarousel,
} from "../controllers/carouselController.js";

const router = express.Router();

/**
 * ============================================================
 *  CAROUSEL ROUTES (Hero Section Configuration)
 * ============================================================
 *
 *  POST   /api/carousel        → Create new carousel config
 *  GET    /api/carousel        → Get all carousel configs (Admin)
 *  GET    /api/carousel/active → Get active carousel (Frontend Hero)
 *  PUT    /api/carousel/:id    → Update existing carousel
 *  DELETE /api/carousel/:id    → Delete a carousel config
 *
 *  Supports:
 *  - 3 Images (Required)
 *  - Phrases (3–5 items) for typewriter effect
 *  - Title → Auto converted to 1st phrase (for backward compatibility)
 *  - Full CRUD with validation
 * ============================================================
 */

// 🟢 Create new carousel config
router.post("/", createCarousel);

// 🟡 Get all (Admin list)
router.get("/", getAllCarousel);

// 🔵 Get latest active (Hero section ke liye)
router.get("/active", getActiveCarousel);

// ✏️ Update carousel
router.put("/:id", updateCarousel);

// ❌ Delete carousel
router.delete("/:id", deleteCarousel);

export default router;
