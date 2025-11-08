import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// 🟢 Register Admin (optional – use once to create admin)
router.post("/register", registerAdmin);

// 🔵 Login Admin (for Netlify frontend)
router.post("/login", loginAdmin);

export default router;
