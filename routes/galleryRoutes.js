import express from "express";
import upload from "../config/multer.js";
import {
  createGalleryItem,
  getGalleryItems,
  deleteGalleryItem,
} from "../controllers/galleryController.js";

const router = express.Router();

router.post("/", upload.single("file"), createGalleryItem);
router.get("/", getGalleryItems);
router.delete("/:id", deleteGalleryItem);

export default router;
