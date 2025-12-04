const express = require("express");
const router = express.Router();

const {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");

// Public
router.get("/", getAbout);

// Admin (yahan par chahe to auth middleware laga do)
// const { protect, admin } = require("../middleware/authMiddleware");
// router.post("/", protect, admin, createAbout);
// router.put("/:id", protect, admin, updateAbout);
// router.delete("/:id", protect, admin, deleteAbout);

router.post("/", createAbout);
router.put("/:id", updateAbout);
router.delete("/:id", deleteAbout);

module.exports = router;
