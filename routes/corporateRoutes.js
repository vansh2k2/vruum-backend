// routes/corporateRoutes.js
import express from "express";
import {
  registerCorporate,
  getAllCorporates,
  getCorporateById,
  updateStatus,
  deleteCorporate,
  getStats
} from "../controllers/corporateController.js";

const router = express.Router();

// ✅ Public Routes
router.post('/register', registerCorporate);

// ✅ Admin Routes (Add your admin auth middleware later)
router.get('/admin/all', getAllCorporates);
router.get('/admin/stats', getStats);
router.get('/:id', getCorporateById);
router.put('/:id/status', updateStatus);
router.delete('/:id', deleteCorporate);

export default router; // ✅ ES Module export