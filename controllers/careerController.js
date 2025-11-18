import Career from "../models/Career.js";

// GET /api/careers
export const getCareers = async (req, res) => {
  try {
    const docs = await Career.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: docs });
  } catch (e) {
    console.error("GET Careers Error:", e);
    return res.status(500).json({ success: false, message: "Failed to fetch careers" });
  }
};

// GET /api/careers/:id
export const getCareer = async (req, res) => {
  try {
    const doc = await Career.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: doc });
  } catch (e) {
    console.error("GET Career Error:", e);
    return res.status(500).json({ success: false, message: "Failed to fetch career" });
  }
};

// POST /api/careers
export const createCareer = async (req, res) => {
  try {
    const payload = req.body;
    const created = await Career.create(payload);
    return res.status(201).json({ success: true, data: created });
  } catch (e) {
    console.error("Create Career Error:", e);
    return res.status(500).json({ success: false, message: "Failed to create career" });
  }
};

// PUT /api/careers/:id
export const updateCareer = async (req, res) => {
  try {
    const updated = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: updated });
  } catch (e) {
    console.error("Update Career Error:", e);
    return res.status(500).json({ success: false, message: "Failed to update career" });
  }
};

// DELETE /api/careers/:id
export const deleteCareer = async (req, res) => {
  try {
    const removed = await Career.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (e) {
    console.error("Delete Career Error:", e);
    return res.status(500).json({ success: false, message: "Failed to delete career" });
  }
};
