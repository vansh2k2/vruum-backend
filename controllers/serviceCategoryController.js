import ServiceCategory from "../models/ServiceCategory.js";

// CREATE CATEGORY
export const createServiceCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL CATEGORIES
export const getServiceCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find()
      .sort({ order: 1, createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE CATEGORY
export const deleteServiceCategory = async (req, res) => {
  try {
    await ServiceCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
