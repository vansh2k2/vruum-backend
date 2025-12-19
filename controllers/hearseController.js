import Partner from "../models/Partner.js";  // ✅ CORRECT
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const uploadToCloudinary = async (file) => {
  try {
    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "hearse",
    });
    return uploaded.secure_url;
  } catch (error) {
    console.error("Cloudinary Error:", error);
    return null;
  }
};

// =============================
// REGISTER HEARSE
// =============================
export const registerHearse = async (req, res) => {
  try {
    const data = {
      ...req.body,
      category: "hearse",      // ✅ Set category
      role: "hearse",          // ✅ Set role
      status: "pending",
    };

    // ✅ Validation
    if (!data.password || !data.phoneNumber || !data.fullName) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing (fullName, phoneNumber, password)",
      });
    }

    // ✅ Check duplicate phone number
    const exists = await Partner.findOne({ phoneNumber: data.phoneNumber });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Hash password
    data.password = await bcrypt.hash(data.password, 10);

    const files = req.files;
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

    // ✅ Use Partner model
    const hearse = await Partner.create({
      ...data,
      ...uploadedFiles,
    });

    return res.status(201).json({
      success: true,
      message: "Hearse registration successful. Your profile will be verified within 24-48 hours.",
      hearse,
    });
  } catch (error) {
    console.error("HEARSE REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during hearse registration",
    });
  }
};

// =============================
// LOGIN HEARSE
// =============================
export const loginHearse = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password required",
      });
    }

    // ✅ Filter by category
    const hearse = await Partner.findOne({ 
      phoneNumber,
      category: "hearse" 
    });

    if (!hearse) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, hearse.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (hearse.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          hearse.status === "pending"
            ? "Your profile is under verification"
            : "Your profile has been rejected",
      });
    }

    const token = jwt.sign(
      { id: hearse._id, role: "hearse" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      hearse,
      token,
    });
  } catch (error) {
    console.error("HEARSE LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// =============================
// ADMIN: GET ALL HEARSE
// =============================
export const getAllHearse = async (req, res) => {
  try {
    // ✅ Filter by category
    const list = await Partner.find({ category: "hearse" })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: list });
  } catch (error) {
    console.error("GET HEARSE ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch hearse" 
    });
  }
};

// =============================
// ADMIN: GET SINGLE HEARSE
// =============================
export const getHearseById = async (req, res) => {
  try {
    const hearse = await Partner.findById(req.params.id);

    if (!hearse) {
      return res.status(404).json({
        success: false,
        message: "Hearse not found",
      });
    }

    return res.json({
      success: true,
      hearse,
    });
  } catch (error) {
    console.error("GET HEARSE BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hearse",
    });
  }
};

// =============================
// ADMIN: APPROVE / REJECT
// =============================
export const approveHearse = async (req, res) => {
  try {
    const hearse = await Partner.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!hearse) {
      return res.status(404).json({
        success: false,
        message: "Hearse not found"
      });
    }

    res.json({ success: true, hearse });
  } catch (error) {
    console.error("APPROVE HEARSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Approval failed"
    });
  }
};

export const rejectHearse = async (req, res) => {
  try {
    const hearse = await Partner.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!hearse) {
      return res.status(404).json({
        success: false,
        message: "Hearse not found"
      });
    }

    res.json({ success: true, hearse });
  } catch (error) {
    console.error("REJECT HEARSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Rejection failed"
    });
  }
};

// =============================
// ADMIN: DELETE HEARSE
// =============================
export const deleteHearse = async (req, res) => {
  try {
    const deleted = await Partner.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Hearse not found",
      });
    }

    return res.json({
      success: true,
      message: "Hearse deleted successfully",
    });
  } catch (error) {
    console.error("DELETE HEARSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};