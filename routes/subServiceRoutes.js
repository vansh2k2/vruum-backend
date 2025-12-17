import express from "express";
import {
  createSubService,
  getSubServices,
  updateSubService,
  deleteSubService,
} from "../controllers/subServiceController.js";

const router = express.Router();

// CRUD
router.post("/", createSubService);
router.get("/", getSubServices);
router.put("/:id", updateSubService);
router.delete("/:id", deleteSubService);

export default router;
