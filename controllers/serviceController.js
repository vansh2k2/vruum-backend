import Service from "../models/Service.js";

// ================================
// GET ALL SERVICES
// ================================
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================================
// GET SINGLE SERVICE
// ================================
export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================================
// CREATE SERVICE
// ================================
export const createService = async (req, res) => {
  try {
    const { name, icon, image, features, isActive } = req.body;

    if (!name || !icon || !image) {
      return res.status(400).json({
        success: false,
        message: "Name, icon and image are required",
      });
    }

    const newService = await Service.create({
      name,
      icon,
      image,
      features: features || [],
      isActive: isActive ?? true,
    });

    res.json({
      success: true,
      message: "Service created successfully",
      service: newService,
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================================
// UPDATE SERVICE
// ================================
export const updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({
      success: true,
      message: "Service updated successfully",
      service: updated,
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================================
// DELETE SERVICE
// ================================
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({
      success: true,
      message: "Service deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
