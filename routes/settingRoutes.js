// routes/settingRoutes.js
import express from "express";
import { getSettings, updateSettings } from "../controllers/settingController.js";

const router = express.Router();

// 🔒 TODO: apne admin auth middleware yahan lagao (e.g., verifyAdmin)
const requireAdmin = (req, res, next) => next(); // placeholder

router.get("/", getSettings);
router.put("/", requireAdmin, updateSettings);

export default router;
