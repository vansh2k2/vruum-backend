import express from "express";
import { registerPassenger, loginPassenger } from "../controllers/passengerAuthController.js";

const router = express.Router();

// REGISTER ROUTE
router.post("/register", registerPassenger);

// LOGIN ROUTE
router.post("/login", loginPassenger);

export default router;
