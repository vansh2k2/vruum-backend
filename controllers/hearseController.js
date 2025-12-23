import Hearse from "../models/Hearse.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =====================================================
   CLOUDINARY UPLOAD HELPER
===================================================== */
const uploadToCloudinary = async (file, folder = "hearse") => {
  if (!file) return "";
  const result = await cloudinary.uploader.upload(file.path, {
    folder,
  });
  return result.secure_url;
};

/* =====================================================
   REGISTER HEARSE SERVICE
===================================================== */
export const registerHearse = async (req, res) => {
  try {
    const data = {
      ...req.body,
      category: "hearse",
      role: "hearse",
      status: "pending",            // admin verification
      isApproved: false,            // 🔥 IMPORTANT
      availabilityStatus: "available", // working state
    };

    /* ---------- REQUIRED FIELDS ---------- */
    if (
      !data.phoneNumber ||
      !data.password ||
      !data.fullName ||
      !data.vehicleNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    /* ---------- DUPLICATE CHECK ---------- */
    const exists = await Hearse.findOne({
      phoneNumber: data.phoneNumber,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    /* ---------- HASH PASSWORD ---------- */
    data.password = await bcrypt.hash(data.password, 10);

    /* ---------- FILE UPLOADS ---------- */
    const files = req.files || {};
    const uploadMap = [
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

    for (const field of uploadMap) {
      if (files[field]?.[0]) {
        data[field] = await uploadToCloudinary(
          files[field][0],
          "hearse"
        );
      }
    }

    const hearse = await Hearse.create(data);

    return res.status(201).json({
      success: true,
      message:
        "Hearse registration submitted successfully. Verification pending.",
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

/* =====================================================
   LOGIN HEARSE (ADMIN APPROVAL REQUIRED)
===================================================== */
export const loginHearse = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password required",
      });
    }

    const hearse = await Hearse.findOne({ phoneNumber });
    if (!hearse) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      hearse.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!hearse.isApproved) {
      return res.status(403).json({
        success: false,
        message:
          "Your hearse service is under verification. Our team will contact you within 24 hours.",
      });
    }

    const token = jwt.sign(
      {
        id: hearse._id,
        role: "hearse",
        status: hearse.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      hearse,
    });
  } catch (error) {
    console.error("HEARSE LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/* =====================================================
   ADMIN – GET ALL HEARSES
===================================================== */
export const getAllHearses = async (req, res) => {
  try {
    const hearses = await Hearse.find({
      role: "hearse",
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: hearses,
    });
  } catch (error) {
    console.error("GET HEARSES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hearses",
    });
  }
};

/* =====================================================
   ADMIN – GET SINGLE HEARSE
===================================================== */
export const getHearseById = async (req, res) => {
  try {
    const hearse = await Hearse.findById(req.params.id);
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
    console.error("GET HEARSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hearse",
    });
  }
};

/* =====================================================
   ADMIN – APPROVE HEARSE
===================================================== */
export const approveHearse = async (req, res) => {
  try {
    const hearse = await Hearse.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        isApproved: true,
      },
      { new: true }
    );

    if (!hearse) {
      return res.status(404).json({
        success: false,
        message: "Hearse not found",
      });
    }

    return res.json({
      success: true,
      message: "Hearse service approved successfully",
      hearse,
    });
  } catch (error) {
    console.error("APPROVE HEARSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

/* =====================================================
   ADMIN – REJECT HEARSE
===================================================== */
export const rejectHearse = async (req, res) => {
  try {
    const hearse = await Hearse.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        isApproved: false,
      },
      { new: true }
    );

    if (!hearse) {
      return res.status(404).json({
        success: false,
        message: "Hearse not found",
      });
    }

    return res.json({
      success: true,
      message: "Hearse service rejected",
      hearse,
    });
  } catch (error) {
    console.error("REJECT HEARSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

/* =====================================================
   UPDATE HEARSE AVAILABILITY
===================================================== */
export const updateHearseStatus = async (req, res) => {
  try {
    const { availabilityStatus } = req.body;
    const validStatuses = ["on-duty", "available"];

    if (!validStatuses.includes(availabilityStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Use 'on-duty' or 'available'",
      });
    }

    const hearse = await Hearse.findByIdAndUpdate(
      req.params.id,
      { availabilityStatus },
      { new: true }
    );

    if (!hearse) {
      return res.status(404).json({
        success: false,
        message: "Hearse not found",
      });
    }

    return res.json({
      success: true,
      message: `Hearse is now ${availabilityStatus}`,
      hearse,
    });
  } catch (error) {
    console.error(
      "UPDATE HEARSE STATUS ERROR:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
};

/* =====================================================
   ADMIN – DELETE HEARSE
===================================================== */
export const deleteHearse = async (req, res) => {
  try {
    const deleted = await Hearse.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Hearse not found",
      });
    }

    return res.json({
      success: true,
      message: "Hearse service deleted successfully",
    });
  } catch (error) {
    console.error("DELETE HEARSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
