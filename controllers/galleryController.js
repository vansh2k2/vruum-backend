import cloudinary from "../config/cloudinary.js";
import Gallery from "../models/galleryModel.js";
import streamifier from "streamifier";

export const createGalleryItem = async (req, res) => {
  try {
    const { title, category, type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    // Upload buffer to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "gallery",
            resource_type: type === "video" ? "video" : "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const uploaded = await uploadToCloudinary();

    // Save DB
    const item = await Gallery.create({
      title,
      category,
      type,
      url: uploaded.secure_url,
    });

    res.status(201).json({
      success: true,
      item,
    });

  } catch (err) {
    console.error("Gallery Upload Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while uploading",
    });
  }
};

export const getGalleryItems = async (req, res) => {
  const items = await Gallery.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items });
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    await item.deleteOne();

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete error" });
  }
};
