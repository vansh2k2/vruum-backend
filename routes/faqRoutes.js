import express from "express";
import FAQ from "../models/FAQ.js";

const router = express.Router();

// ✅ Get all FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new FAQ
router.post("/", async (req, res) => {
  try {
    const newFAQ = new FAQ(req.body);
    await newFAQ.save();
    res.json({ success: true, message: "FAQ added!", faq: newFAQ });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update FAQ
router.put("/:id", async (req, res) => {
  try {
    const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "FAQ updated!", faq: updatedFAQ });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete FAQ
router.delete("/:id", async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "FAQ deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
