// controllers/settingController.js
import Setting from "../models/Setting.js";

// GET /api/settings  (Public)
export const getSettings = async (req, res) => {
  try {
    let doc = await Setting.findOne();

    // If NO document → create new with defaults
    if (!doc) {
      doc = await Setting.create({
        counters: {
          happyCustomers: 1200,
          totalRides: 5000,
          citiesCovered: 50,
          professionalDrivers: 300,
        },
        socialLinks: {},
      });
    }

    // 🔥 IMPORTANT FIX: If counters missing → auto add defaults
    if (!doc.counters) {
      doc.counters = {
        happyCustomers: 1200,
        totalRides: 5000,
        citiesCovered: 50,
        professionalDrivers: 300,
      };
      await doc.save();
    }

    // Return updated doc
    return res.json({
      success: true,
      settings: doc,
    });

  } catch (e) {
    console.error("Settings GET Error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to load settings",
    });
  }
};

// PUT /api/settings (Admin)
export const updateSettings = async (req, res) => {
  try {
    const payload = req.body;

    const updated = await Setting.findOneAndUpdate(
      {},
      {
        $set: {
          siteName: payload.siteName,
          contactEmail: payload.contactEmail,
          contactPhone: payload.contactPhone,
          logo: payload.logo,

          socialLinks: {
            facebook: payload.socialLinks?.facebook || "",
            twitter: payload.socialLinks?.twitter || "",
            instagram: payload.socialLinks?.instagram || "",
            linkedin: payload.socialLinks?.linkedin || "",
            youtube: payload.socialLinks?.youtube || "",
          },

          counters: {
            happyCustomers: payload.counters?.happyCustomers || 0,
            totalRides: payload.counters?.totalRides || 0,
            citiesCovered: payload.counters?.citiesCovered || 0,
            professionalDrivers: payload.counters?.professionalDrivers || 0,
          },
        },
      },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      settings: updated,
    });

  } catch (e) {
    console.error("Settings UPDATE Error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};
