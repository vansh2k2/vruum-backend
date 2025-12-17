import express from "express";
import {
  createServiceCategory,
  getServiceCategories,
  updateServiceCategory,
  deleteServiceCategory,
} from "../controllers/serviceCategoryController.js";

const router = express.Router();

router.post("/", createServiceCategory);
router.get("/", getServiceCategories);
router.put("/:id", updateServiceCategory);
router.delete("/:id", deleteServiceCategory);

export default router;
