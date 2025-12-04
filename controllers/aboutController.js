const About = require("../models/About");

// GET /api/about  (public – frontend use)
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About content not found" });
    }
    res.json(about);
  } catch (error) {
    console.error("Error in getAbout:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/about  (admin – create first time)
exports.createAbout = async (req, res) => {
  try {
    // If you are using multer/cloudinary, you can get URLs from req.files / req.body
    const {
      heading,
      experienceYears,
      experienceLabel,
      missionTitle,
      missionText,
      visionTitle,
      visionPoints, // comma or \n separated string from frontend
      mainImage,
      secondaryImage,
    } = req.body;

    const pointsArray = Array.isArray(visionPoints)
      ? visionPoints
      : String(visionPoints || "")
          .split("\n")
          .map((p) => p.trim())
          .filter(Boolean);

    const about = new About({
      heading,
      experienceYears,
      experienceLabel,
      missionTitle,
      missionText,
      visionTitle,
      visionPoints: pointsArray,
      mainImage,
      secondaryImage,
    });

    await about.save();
    res.status(201).json(about);
  } catch (error) {
    console.error("Error in createAbout:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/about/:id  (admin – update)
exports.updateAbout = async (req, res) => {
  try {
    const {
      heading,
      experienceYears,
      experienceLabel,
      missionTitle,
      missionText,
      visionTitle,
      visionPoints,
      mainImage,
      secondaryImage,
    } = req.body;

    const updates = {
      heading,
      experienceYears,
      experienceLabel,
      missionTitle,
      missionText,
      visionTitle,
    };

    if (visionPoints !== undefined) {
      updates.visionPoints = Array.isArray(visionPoints)
        ? visionPoints
        : String(visionPoints || "")
            .split("\n")
            .map((p) => p.trim())
            .filter(Boolean);
    }

    if (mainImage) updates.mainImage = mainImage;
    if (secondaryImage) updates.secondaryImage = secondaryImage;

    const about = await About.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!about) {
      return res.status(404).json({ message: "About content not found" });
    }

    res.json(about);
  } catch (error) {
    console.error("Error in updateAbout:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/about/:id (optional)
exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findByIdAndDelete(req.params.id);
    if (!about) {
      return res.status(404).json({ message: "About content not found" });
    }
    res.json({ message: "About content deleted" });
  } catch (error) {
    console.error("Error in deleteAbout:", error);
    res.status(500).json({ message: "Server error" });
  }
};
