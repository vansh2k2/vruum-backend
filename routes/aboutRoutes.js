import express from "express";
import {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
} from "../controllers/aboutController.js";

const router = express.Router();

router.get("/", getAbout);
router.post("/", createAbout);
router.put("/:id", updateAbout);
router.delete("/:id", deleteAbout);

export default router;
