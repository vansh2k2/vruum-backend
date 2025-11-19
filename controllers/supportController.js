import Support from "../models/Support.js";

// ================= CREATE SUPPORT QUERY =================
export const createSupport = async (req, res) => {
  try {
    const support = await Support.create(req.body);

    res.json({
      success: true,
      message: "Support query submitted successfully",
      support,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= GET ALL SUPPORT QUERIES =================
export const getSupport = async (req, res) => {
  try {
    const support = await Support.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      support,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= DELETE QUERY =================
export const deleteSupport = async (req, res) => {
  try {
    await Support.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Support query deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
