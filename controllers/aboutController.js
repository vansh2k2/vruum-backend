import About from "../models/About.js";

// GET /api/about (public)
export const getAbout = async (req, res) => {
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

// POST /api/about (admin)
export const createAbout = async (req, res) => {
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

// PUT /api/about/:id (admin)
export const updateAbout = async (req, res) => {
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

// DELETE /api/about/:id
export const deleteAbout = async (req, res) => {
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
