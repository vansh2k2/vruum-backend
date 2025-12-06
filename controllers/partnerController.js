import Partner from "../models/Partner.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
// REGISTER PARTNER / DRIVER / AMBULANCE / HEARSE
// =============================
export const registerPartner = async (req, res) => {
  try {
    // 🔥 IMPORTANT — FIX: Always include category
    let data = {
      ...req.body,
      category: req.body.category || "partner",
    };

    let files = req.files;

    // Validate password
    if (!data.password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

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
      "insuranceCertificate",
    ];

    for (const field of uploadFields) {
      if (files && files[field]) {
        const url = await uploadToCloudinary(files[field][0]);
        uploadedFiles[field] = url;
      }
    }

    // Create partner record
    const newPartner = await Partner.create({
      ...data,
      ...uploadedFiles,
      password: hashedPassword,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
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
// LOGIN PARTNER
// =============================
export const loginPartner = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number & password required",
      });
    }

    const partner = await Partner.findOne({ phoneNumber });

    if (!partner) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    if (partner.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          partner.status === "pending"
            ? "Your profile is pending approval"
            : "Your profile has been rejected",
      });
    }

    const token = jwt.sign(
      { id: partner._id, role: "partner" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      partner,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// =============================
// GET ALL PARTNERS
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
