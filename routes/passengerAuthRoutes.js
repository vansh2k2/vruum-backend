import express from "express";
import {
  registerPassenger,
  loginPassenger,
  getAllPassengers,
  deletePassenger,
} from "../controllers/passengerAuthController.js";

const router = express.Router();

// USER PUBLIC ROUTES
router.post("/register", registerPassenger);
router.post("/login", loginPassenger);

// ADMIN ROUTES
router.get("/all", getAllPassengers);
router.delete("/:id", deletePassenger);

export default router;
