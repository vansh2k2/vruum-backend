import cloudinary from "../config/cloudinary.js";
import Gallery from "../models/galleryModel.js";
import streamifier from "streamifier";

// ======================================
// CREATE ITEM
// ======================================
export const createGalleryItem = async (req, res) => {
  try {
    const { title, category, type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "gallery",
            resource_type: type === "video" ? "video" : "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    };

    const uploaded = await uploadToCloudinary();

    const item = await Gallery.create({
      title,
      category,
      type,
      url: uploaded.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Uploaded successfully",
      item,
    });

  } catch (err) {
    console.error("Gallery Upload Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading",
    });
  }
};

// ======================================
// GET ALL ITEMS
// ======================================
export const getGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ======================================
// DELETE ITEM
// ======================================
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // extract public_id from cloudinary URL
    const publicId = item.url.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy("gallery/" + publicId, {
      resource_type: item.type === "video" ? "video" : "image",
    });

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
