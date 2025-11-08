import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// ✅ CREATE contact
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, reason, message } = req.body;

    if (!name || !email || !reason || !message) {
      return res.status(400).json({
        success: false,
        error: "All required fields must be filled",
      });
    }

    const newContact = new Contact({ name, email, phone, reason, message });
    await newContact.save();

    res.status(201).json({ success: true, message: "Message submitted successfully!" });
  } catch (error) {
    console.error("❌ Error saving contact:", error);
    res.status(500).json({ success: false, error: "Server error while saving contact" });
  }
});

// ✅ GET all contacts (for Admin Panel)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching contacts" });
  }
});

// ✅ DELETE contact
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Contact not found" });
    res.json({ success: true, message: "Contact deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error deleting contact" });
  }
});

export default router;

