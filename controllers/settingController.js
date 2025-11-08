// controllers/settingController.js
import Setting from "../models/Setting.js";

// GET /api/settings  (Public)
export const getSettings = async (req, res) => {
  try {
    let doc = await Setting.findOne();
    if (!doc) doc = await Setting.create({});
    return res.json({ success: true, settings: doc });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Failed to load settings" });
  }
};

// PUT /api/settings  (Admin)
export const updateSettings = async (req, res) => {
  try {
    const payload = req.body; // { siteName, contactEmail, contactPhone, logo, socialLinks:{...} }
    const updated = await Setting.findOneAndUpdate(
      {},
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json({ success: true, settings: updated });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Failed to update settings" });
  }
};
