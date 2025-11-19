import Partner from "../models/Partner.js";
import cloudinary from "../config/cloudinary.js";

// Helper for uploading to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "partners",
    });
    return uploaded.secure_url;
  } catch (error) {
    console.error("Cloudinary Error:", error);
    return null;
  }
};

// =============================
// CREATE PARTNER (REGISTER)
// =============================
export const registerPartner = async (req, res) => {
  try {
    let data = req.body;
    let files = req.files;

    // Upload images
    const uploadedFiles = {};

    const uploadFields = [
      "profilePhoto",
      "vehiclePicture",
      "aadharFront",
      "aadharBack",
      "dlFront",
      "dlBack",
      "policeClearance",
      "rcCertificate",
      "fitnessCertificate",
      "pollutionCertificate",
      "insuranceCertificate"
    ];

    for (const field of uploadFields) {
      if (files[field]) {
        const url = await uploadToCloudinary(files[field][0]);
        uploadedFiles[field] = url;
      }
    }

    const newPartner = await Partner.create({
      ...data,
      ...uploadedFiles,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Partner registered successfully!",
      partner: newPartner,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// =============================
// GET ALL PARTNERS (ADMIN)
// =============================
export const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      partners,
    });
  } catch (error) {
    console.error("Get All Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch partners",
    });
  }
};

// =============================
// GET SINGLE PARTNER
// =============================
export const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    return res.json({
      success: true,
      partner,
    });
  } catch (error) {
    console.error("Get Single Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get partner",
    });
  }
};

// =============================
// DELETE PARTNER
// =============================
export const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    return res.json({
      success: true,
      message: "Partner deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete partner",
    });
  }
};

// =============================
// APPROVE PARTNER
// =============================
export const approvePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    return res.json({
      success: true,
      message: "Partner approved",
      partner,
    });
  } catch (error) {
    console.error("Approve Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve partner",
    });
  }
};

// =============================
// REJECT PARTNER
// =============================
export const rejectPartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    return res.json({
      success: true,
      message: "Partner rejected",
      partner,
    });
  } catch (error) {
    console.error("Reject Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject partner",
    });
  }
};
