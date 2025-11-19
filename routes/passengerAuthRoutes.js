import express from "express";
import {
  registerPassenger,
  loginPassenger,
  getAllPassengers,
  deletePassenger,
} from "../controllers/passengerAuthController.js";

const router = express.Router();

// USER AUTH
router.post("/register", registerPassenger);
router.post("/login", loginPassenger);

// ADMIN — GET ALL PASSENGERS
router.get("/", getAllPassengers);

// ADMIN — DELETE PASSENGER
router.delete("/:id", deletePassenger);

export default router;
