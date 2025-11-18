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

    // Upload buffer → Cloudinary (using streamifier)
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "gallery",
            resource_type: type === "video" ? "video" : "image",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Error:", error);
              return reject(error);
            }
            resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    };

    const uploaded = await uploadToCloudinary();

    // Save to MongoDB
    const item = await Gallery.create({
      title,
      category,
      type,
      url: uploaded.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Uploaded successfully",
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
