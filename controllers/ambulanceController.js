import Ambulance from "../models/Ambulance.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =====================================================
   CLOUDINARY UPLOAD HELPER
===================================================== */
const uploadToCloudinary = async (file, folder = "ambulance") => {
  if (!file) return "";
  const result = await cloudinary.uploader.upload(file.path, {
    folder,
  });
  return result.secure_url;
};

/* =====================================================
   REGISTER AMBULANCE SERVICE
===================================================== */
export const registerAmbulance = async (req, res) => {
  try {
    const data = {
      ...req.body,
      category: "ambulance",
      role: "ambulance",
      status: "pending",          // admin verification
      isApproved: false,          // 🔥 IMPORTANT
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
    const exists = await Ambulance.findOne({
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
          "ambulance"
        );
      }
    }

    const ambulance = await Ambulance.create(data);

    return res.status(201).json({
      success: true,
      message:
        "Registration submitted successfully. Your KYC will be verified within 24 hours.",
      ambulance,
    });
  } catch (error) {
    console.error("AMBULANCE REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during ambulance registration",
    });
  }
};

/* =====================================================
   LOGIN AMBULANCE (ADMIN APPROVAL REQUIRED)
===================================================== */
export const loginAmbulance = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password required",
      });
    }

    const ambulance = await Ambulance.findOne({ phoneNumber });
    if (!ambulance) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      ambulance.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!ambulance.isApproved) {
      return res.status(403).json({
        success: false,
        message:
          "Your KYC is under verification. Our team will contact you within 24 hours.",
      });
    }

    const token = jwt.sign(
      {
        id: ambulance._id,
        role: "ambulance",
        status: ambulance.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      ambulance,
    });
  } catch (error) {
    console.error("AMBULANCE LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/* =====================================================
   ADMIN – GET ALL AMBULANCES
===================================================== */
export const getAllAmbulances = async (req, res) => {
  try {
    const ambulances = await Ambulance.find({
      role: "ambulance",
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: ambulances,
    });
  } catch (error) {
    console.error("GET AMBULANCES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ambulances",
    });
  }
};

/* =====================================================
   ADMIN – GET SINGLE AMBULANCE
===================================================== */
export const getAmbulanceById = async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id);
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    return res.json({
      success: true,
      ambulance,
    });
  } catch (error) {
    console.error("GET AMBULANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ambulance",
    });
  }
};

/* =====================================================
   ADMIN – APPROVE AMBULANCE
===================================================== */
export const approveAmbulance = async (req, res) => {
  try {
    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        isApproved: true,
      },
      { new: true }
    );

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    return res.json({
      success: true,
      message: "Ambulance service approved successfully",
      ambulance,
    });
  } catch (error) {
    console.error("APPROVE AMBULANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

/* =====================================================
   ADMIN – REJECT AMBULANCE
===================================================== */
export const rejectAmbulance = async (req, res) => {
  try {
    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        isApproved: false,
      },
      { new: true }
    );

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    return res.json({
      success: true,
      message: "Ambulance service rejected",
      ambulance,
    });
  } catch (error) {
    console.error("REJECT AMBULANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

/* =====================================================
   UPDATE AMBULANCE AVAILABILITY
===================================================== */
export const updateAmbulanceStatus = async (req, res) => {
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

    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      { availabilityStatus },
      { new: true }
    );

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    return res.json({
      success: true,
      message: `Ambulance is now ${availabilityStatus}`,
      ambulance,
    });
  } catch (error) {
    console.error(
      "UPDATE AMBULANCE STATUS ERROR:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
};

/* =====================================================
   ADMIN – DELETE AMBULANCE
===================================================== */
export const deleteAmbulance = async (req, res) => {
  try {
    const deleted = await Ambulance.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    return res.json({
      success: true,
      message: "Ambulance service deleted successfully",
    });
  } catch (error) {
    console.error("DELETE AMBULANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
