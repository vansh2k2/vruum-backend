import SubService from "../models/SubService.js";

// =====================================================
// CREATE
// =====================================================
export const createSubService = async (req, res) => {
  try {
    const subService = await SubService.create(req.body);

    res.status(201).json({
      success: true,
      subService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL (with optional category filter)
// =====================================================
export const getSubServices = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const subServices = await SubService.find(filter)
      .populate("category", "name slug")
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      subServices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE
// =====================================================
export const updateSubService = async (req, res) => {
  try {
    const subService = await SubService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      subService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE
// =====================================================
export const deleteSubService = async (req, res) => {
  try {
    await SubService.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Sub Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
