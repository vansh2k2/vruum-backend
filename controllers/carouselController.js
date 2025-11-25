import Carousel from "../models/Carousel.js";

// ========================================================
// CREATE NEW CAROUSEL CONFIG
// ========================================================
export const createCarousel = async (req, res) => {
  try {
    let {
      title,
      phrases,
      subtitle,
      buttonText,
      overlayOpacity,
      isActive,
      images,
    } = req.body;

    // -------------------------------
    // VALIDATION: Images
    // -------------------------------
    if (!images || !Array.isArray(images) || images.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Exactly 3 images are required",
      });
    }

    // -------------------------------
    // VALIDATION: Main Required Fields
    // -------------------------------
    if (!title || !subtitle) {
      return res.status(400).json({
        success: false,
        message: "Title and subtitle are required",
      });
    }

    // -------------------------------
    // VALIDATION: Phrases — optional but if provided then 3–5 required
    // -------------------------------
    if (phrases && phrases.length > 0) {
      if (!Array.isArray(phrases)) {
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
    } else {
      // If phrases are empty → fallback to 1st phrase as title
      phrases = [title];
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

    return res.json({
      success: true,
      message: "Carousel created successfully",
      carousel: newCarousel,
    });
  } catch (error) {
    console.error("❌ Error creating carousel:", error.message);
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
    console.error("❌ Error fetching carousels:", error.message);
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
    console.error("❌ Error fetching active carousel:", error.message);
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

    if (title) updateData.title = title;
    if (subtitle) updateData.subtitle = subtitle;
    if (buttonText) updateData.buttonText = buttonText;
    if (overlayOpacity !== undefined)
      updateData.overlayOpacity = overlayOpacity;
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (images && Array.isArray(images) && images.length === 3)
      updateData.images = images;

    // -------------------------------
    // PHRASES VALIDATION & MERGE
    // -------------------------------
    if (phrases && phrases.length > 0) {
      if (phrases.length < 3 || phrases.length > 5) {
        return res.status(400).json({
          success: false,
          message: "Phrases must contain between 3 to 5 items",
        });
      }
      updateData.phrases = phrases;
    }

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
    console.error("❌ Error updating carousel:", error.message);
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
    console.error("❌ Error deleting carousel:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting carousel",
    });
  }
};
