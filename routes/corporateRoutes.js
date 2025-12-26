import express from "express";
import {
  registerCorporate,
  loginCorporate,
  getAllCorporates,
  getCorporateById,
  approveCorporate,
  rejectCorporate,
  updateCorporateStatus,
  deleteCorporate,
  getCorporateStats
} from "../controllers/corporateController.js";

const router = express.Router();

// ✅ PUBLIC ROUTES
router.post('/register', registerCorporate);
router.post('/login', loginCorporate);

// ✅ ADMIN ROUTES - CORPORATE MANAGEMENT
router.get('/admin/all', getAllCorporates);           // GET /api/corporate/admin/all
router.get('/admin/stats', getCorporateStats);        // GET /api/corporate/admin/stats

// ✅ SINGLE CORPORATE OPERATIONS
router.get('/admin/:id', getCorporateById);           // GET /api/corporate/admin/:id ✅
router.put('/admin/:id/approve', approveCorporate);   // PUT /api/corporate/admin/:id/approve ✅
router.put('/admin/:id/reject', rejectCorporate);     // PUT /api/corporate/admin/:id/reject ✅
router.put('/admin/:id/status', updateCorporateStatus); // PUT /api/corporate/admin/:id/status ✅
router.delete('/admin/:id', deleteCorporate);         // DELETE /api/corporate/admin/:id ✅

// ✅ TEST ROUTE
router.get('/test-login', (req, res) => {
  res.json({
    success: true,
    message: 'Corporate login endpoint is working',
    endpoint: '/api/corporate/login',
    method: 'POST',
    expectedBody: {
      email: 'string (company email or contact email)',
      password: 'string (min 6 chars)'
    }
  });
});

export default router;