import express from "express";
import upload from "../config/multer.js";
import {
  createGalleryItem,
  getGalleryItems,
  deleteGalleryItem,
} from "../controllers/galleryController.js";

const router = express.Router();

// Upload route (FIELD = "file")
router.post("/", upload.single("file"), createGalleryItem);

// Get all gallery items
router.get("/", getGalleryItems);

// Delete gallery item
router.delete("/:id", deleteGalleryItem);

export default router;
