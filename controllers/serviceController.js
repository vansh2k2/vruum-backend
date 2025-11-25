// backend/controllers/serviceController.js
import Service from "../models/Service.js";
import path from "path";

// Helper: full image URL
const makeImageUrl = (req, filePath) => {
  return `${req.protocol}://${req.get("host")}/${filePath}`;
};

// USER SIDE
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("getServices error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN GET ALL
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("getAllServices error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CREATE SERVICE
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
    let imageUrl = null;
    if (req.file) {
      imageUrl = makeImageUrl(req, req.file.path);
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // FEATURES SAFE PARSE
    const featureArray =
      typeof features === "string"
        ? features.split(",").map((f) => f.trim()).filter(Boolean)
        : [];

    const service = await Service.create({
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

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    console.error("createService error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE SERVICE
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

    // FEATURES SAFE PARSE
    if (features) {
      updates.features = features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    }

    // IMAGE UPDATE
    if (req.file) {
      updates.imageUrl = makeImageUrl(req, req.file.path);
    }

    const service = await Service.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: service });
  } catch (err) {
    console.error("updateService error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE SERVICE
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, message: "Service deleted" });
  } catch (err) {
    console.error("deleteService error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
