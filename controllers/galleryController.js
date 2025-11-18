import Gallery from "../models/galleryModel.js";
import cloudinary from "../config/cloudinary.js";

// ====================== ADD ITEM ======================
export const addGalleryItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File missing" });
    }

    const file = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: "vruum_gallery",
      resource_type: "auto",
    });

    const newItem = await Gallery.create({
      type: req.body.type,
      url: result.secure_url,
      public_id: result.public_id,
    });

    res.json({
      success: true,
      message: "Gallery item added!",
      data: newItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ====================== GET ALL ======================
export const getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ====================== DELETE ======================
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(item.public_id, {
      resource_type: item.type === "video" ? "video" : "image",
    });

    await item.deleteOne();

    res.json({ success: true, message: "Item deleted successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
