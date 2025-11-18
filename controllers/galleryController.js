import cloudinary from "../config/cloudinary.js";
import Gallery from "../models/galleryModel.js";

export const createGalleryItem = async (req, res) => {
  try {
    const { title, category, type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    // Upload buffer to cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      { resource_type: type === "video" ? "video" : "image", folder: "gallery" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ success: false, message: "Upload failed" });
        }

        const item = await Gallery.create({
          title,
          category,
          type,
          url: result.secure_url,
        });

        res.status(201).json({ success: true, item });
      }
    );

    // Pipe file buffer
    uploadResult.end(req.file.buffer);

  } catch (err) {
    console.log("Controller Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
