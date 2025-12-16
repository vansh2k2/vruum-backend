import Carousel from "../models/Carousel.js";

// ========================================================
// CREATE NEW CAROUSEL CONFIG
// ========================================================
export const createCarousel = async (req, res) => {
  try {
    let {
      title, // optional (backward compatibility)
      phrases,
      subtitle,
      buttonText,
      overlayOpacity,
      isActive,
      images,
    } = req.body;

    // -------------------------------
    // VALIDATION: Images (3–10 allowed)
    // -------------------------------
    if (!images || !Array.isArray(images) || images.length < 3 || images.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Carousel must have between 3 and 10 images",
      });
    }

    // -------------------------------
    // VALIDATION: Subtitle (required)
    // -------------------------------
    if (!subtitle) {
      return res.status(400).json({
        success: false,
        message: "Subtitle is required",
      });
    }

    // -------------------------------
    // VALIDATION: Phrases (REQUIRED 3–5)
    // -------------------------------
    if (!phrases || !Array.isArray(phrases)) {
      return res.status(400).json({
        success: false,
        message: "Phrases must be an array",
      });
    }

    if (phrases.length < 3 || phrases.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Phrases must contain between 3 to 5 items",
      });
    }

    // -------------------------------
    // AUTO TITLE SYNC
    // -------------------------------
    if (!title) {
      title = phrases[0];
    }

    // -------------------------------
    // CREATE ENTRY
    // -------------------------------
    const newCarousel = await Carousel.create({
      images,
      title,
      phrases,
      subtitle,
      buttonText,
      overlayOpacity,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Carousel created successfully",
      carousel: newCarousel,
    });
  } catch (error) {
    console.error("❌ Error creating carousel:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating carousel",
    });
  }
};

// ========================================================
// GET ALL CAROUSELS
// ========================================================
export const getAllCarousel = async (req, res) => {
  try {
    const carousels = await Carousel.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      carousels,
    });
  } catch (error) {
    console.error("❌ Error fetching carousels:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching carousels",
    });
  }
};

// ========================================================
// GET ACTIVE CAROUSEL FOR HERO SECTION
// ========================================================
export const getActiveCarousel = async (req, res) => {
  try {
    const active = await Carousel.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      carousel: active || null,
    });
  } catch (error) {
    console.error("❌ Error fetching active carousel:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching active carousel",
    });
  }
};

// ========================================================
// UPDATE CAROUSEL
// ========================================================
export const updateCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      title,
      phrases,
      subtitle,
      buttonText,
      overlayOpacity,
      isActive,
      images,
    } = req.body;

    const updateData = {};

    // -------------------------------
    // BASIC FIELD UPDATES
    // -------------------------------
    if (subtitle) updateData.subtitle = subtitle;
    if (buttonText) updateData.buttonText = buttonText;
    if (overlayOpacity !== undefined)
      updateData.overlayOpacity = overlayOpacity;
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    // -------------------------------
    // IMAGES UPDATE (3–10 allowed)
    // -------------------------------
    if (images && Array.isArray(images)) {
      if (images.length < 3 || images.length > 10) {
        return res.status(400).json({
          success: false,
          message: "Carousel must have between 3 and 10 images",
        });
      }
      updateData.images = images;
    }

    // -------------------------------
    // PHRASES UPDATE (3–5 required)
    // -------------------------------
    if (phrases && Array.isArray(phrases)) {
      if (phrases.length < 3 || phrases.length > 5) {
        return res.status(400).json({
          success: false,
          message: "Phrases must contain between 3 to 5 items",
        });
      }
      updateData.phrases = phrases;
      updateData.title = phrases[0]; // 🔥 keep title synced
    }

    // -------------------------------
    // TITLE UPDATE (OPTIONAL)
    // -------------------------------
    if (title) updateData.title = title;

    const updated = await Carousel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Carousel not found",
      });
    }

    return res.json({
      success: true,
      message: "Carousel updated successfully",
      carousel: updated,
    });
  } catch (error) {
    console.error("❌ Error updating carousel:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating carousel",
    });
  }
};

// ========================================================
// DELETE CAROUSEL
// ========================================================
export const deleteCarousel = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Carousel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Carousel not found",
      });
    }

    return res.json({
      success: true,
      message: "Carousel deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting carousel:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting carousel",
    });
  }
};
