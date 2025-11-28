import express from "express";
import { getOfferStrip, updateOfferStrip } from "../controllers/offerStripController.js";
const router = express.Router();

router.get("/", getOfferStrip);
router.put("/", updateOfferStrip);  // admin update karega

export default router;
