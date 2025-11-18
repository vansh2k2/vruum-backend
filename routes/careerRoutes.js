import express from "express";
import {
  getCareers,
  getCareer,
  createCareer,
  updateCareer,
  deleteCareer,
} from "../controllers/careerController.js";

const router = express.Router();

router.get("/", getCareers);
router.get("/:id", getCareer);
router.post("/", createCareer);
router.put("/:id", updateCareer);
router.delete("/:id", deleteCareer);

export default router;
