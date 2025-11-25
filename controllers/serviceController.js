// backend/controllers/serviceController.js
import Service from "../models/Service.js";

// GET /api/services  -> user side (sirf active + sorted)
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("getServices error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN: GET ALL (including inactive)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("getAllServices error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN: CREATE
export const createService = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      features, // comma separated string from form
      badge,
      gradient,
      bgGradient,
      order,
      isActive,
    } = req.body;

    // Agar image upload ho rahi hai (multer se)
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      // e.g. /uploads/filename ya Cloudinary URL
      imageUrl = req.file.path || req.file.location;
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const featureArray = typeof features === "string"
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
      imageUrl,
      order,
      isActive,
    });

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    console.error("createService error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN: UPDATE
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

    if (features) {
      updates.features = features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    }

    if (req.file) {
      updates.imageUrl = req.file.path || req.file.location;
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

// ADMIN: DELETE
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
