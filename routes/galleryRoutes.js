import express from "express";
import { addGalleryItem, getGallery, deleteGalleryItem } from "../controllers/galleryController.js";
import upload from "../config/multer.js";

const router = express.Router();

// ADD
router.post("/", upload.single("file"), addGalleryItem);

// GET
router.get("/", getGallery);

// DELETE
router.delete("/:id", deleteGalleryItem);

export default router;
