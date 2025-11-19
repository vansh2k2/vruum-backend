import express from "express";
import {
  createSupport,
  getSupport,
  deleteSupport,
} from "../controllers/supportController.js";

const router = express.Router();

router.post("/", createSupport);  // SAVE
router.get("/", getSupport);      // GET ALL
router.delete("/:id", deleteSupport); // DELETE

export default router;
