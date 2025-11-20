import express from "express";
import {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from "../controllers/offerController.js";

const router = express.Router();

router.get("/", getOffers);        // GET all
router.post("/", createOffer);     // CREATE
router.put("/:id", updateOffer);   // UPDATE
router.delete("/:id", deleteOffer); // DELETE

export default router;
