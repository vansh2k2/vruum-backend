import express from "express";
import Testimonial from "../models/Testimonial.js";

const router = express.Router();

// ✅ CREATE testimonial
router.post("/", async (req, res) => {
  try {
    const { name, role, rating, feedback, image } = req.body;

    if (!name || !role || !rating || !feedback) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    const newTestimonial = new Testimonial({
      name,
      role,
      rating,
      feedback,
      image,
    });
    await newTestimonial.save();

    res
      .status(201)
      .json({ success: true, message: "Testimonial added successfully!" });
  } catch (error) {
    console.error("❌ Error creating testimonial:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while saving testimonial" });
  }
});

// ✅ GET all testimonials (for Admin & Website)
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching testimonials" });
  }
});

// ✅ DELETE testimonial
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });

    res.json({ success: true, message: "Testimonial deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting testimonial" });
  }
});

// ✅ UPDATE testimonial
router.put("/:id", async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });

    res.json({ success: true, message: "Testimonial updated successfully!", updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating testimonial" });
  }
});

export default router;
