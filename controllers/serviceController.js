// backend/controllers/serviceController.js

import Service from "../models/Service.js";
import path from "path";

// AUTO FULL IMAGE URL BUILDER
const makeImageUrl = (req, filePath) => {
  // Render / Localhost both will work
  return `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;
};

// ==========================================
// USER SIDE - ACTIVE SERVICES ONLY
// ==========================================
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("getServices error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// ADMIN - GET ALL SERVICES
// ==========================================
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("getAllServices error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// ADMIN - CREATE SERVICE
// ==========================================
export const createService = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      features,
      badge,
      gradient,
      bgGradient,
      order,
      isActive,
    } = req.body;

    // IMAGE FIX
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const imageUrl = makeImageUrl(req, req.file.path);

    // FEATURES ARRAY
    const featureArray =
      typeof features === "string"
        ? features.split(",").map((f) => f.trim()).filter(Boolean)
        : [];

    const newService = await Service.create({
      title,
      subtitle,
      description,
      features: featureArray,
      badge,
      gradient,
      bgGradient,
      order,
      isActive,
      imageUrl,
    });

    res.status(201).json({ success: true, data: newService });
  } catch (err) {
    console.error("createService error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// ADMIN - UPDATE SERVICE
// ==========================================
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      subtitle,
      description,
      features,
      badge,
      gradient,
      bgGradient,
      order,
      isActive,
    } = req.body;

    const updates = {
      title,
      subtitle,
      description,
      badge,
      gradient,
      bgGradient,
      order,
      isActive,
    };

    // FEATURE FIX
    if (features) {
      updates.features = features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    }

    // IMAGE UPDATED?
    if (req.file) {
      updates.imageUrl = makeImageUrl(req, req.file.path);
    }

    const updated = await Service.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("updateService error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// ADMIN - DELETE SERVICE
// ==========================================
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Service.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({ success: true, message: "Service deleted" });
  } catch (err) {
    console.error("deleteService error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
