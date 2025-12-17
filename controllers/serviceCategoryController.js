import ServiceCategory from "../models/ServiceCategory.js";

// CREATE CATEGORY
export const createServiceCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.create(req.body);

    res.status(201).json({
      success: true,
      message: "Service category created successfully",
      category,
    });
  } catch (err) {
    console.error("CREATE CATEGORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create category",
    });
  }
};

// GET ALL CATEGORIES
export const getServiceCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find()
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (err) {
    console.error("FETCH CATEGORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch categories",
    });
  }
};

// UPDATE CATEGORY
export const updateServiceCategory = async (req, res) => {
  try {
    const updated = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      category: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE CATEGORY
export const deleteServiceCategory = async (req, res) => {
  try {
    await ServiceCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
