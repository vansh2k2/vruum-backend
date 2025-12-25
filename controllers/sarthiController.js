import Sarthi from "../models/Sarthi.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const uploadToCloudinary = async (file, folder = "sarthi") => {
  if (!file) return "";
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Cloudinary upload error for ${folder}:`, error);
    return "";
  }
};

export const registerSarthi = async (req, res) => {
  try {
    /* ===============================
       1️⃣ PREPARE DATA (CORRECT MAPPING)
    =============================== */
    const data = {
      // Personal details - DIRECT MAPPING
      profilePhoto: "", // will be filled from file
      fullName: req.body.fullName || "",
      lastName: req.body.lastName || "",
      email: req.body.email || "",
      phoneNumber: req.body.phoneNumber || "",
      password: req.body.password || "",
      emergencyNumber: req.body.emergencyNumber || "",
      whatsappNumber: req.body.whatsappNumber || "",
      addressLine1: req.body.addressLine1 || "",
      addressLine2: req.body.addressLine2 || "",
      state: req.body.state || "",
      district: req.body.district || "",
      pincode: req.body.pincode || "",

      // Driver details - CORRECT NAMES
      licenseNumber:
        req.body.licenseNumber || req.body.driverLicenseNumber || "",
      experienceYears:
        req.body.experienceYears || req.body.driverExperienceYears || "",
      preferredCity:
        req.body.preferredCity || req.body.driverPreferredCity || "",
      shiftPreference:
        req.body.shiftPreference || req.body.driverShiftPreference || "",

      // Emergency contacts
      emergencyContact1: req.body.emergencyContact1 || "",
      emergencyRelation1: req.body.emergencyRelation1 || "",
      emergencyContact2: req.body.emergencyContact2 || "",
      emergencyRelation2: req.body.emergencyRelation2 || "",

      // Document fields (init empty)
      aadharFront: "",
      aadharBack: "",
      dlFront: "",
      dlBack: "",
      policeClearance: "",

      // System fields
      // System fields
      category: "driver",
      role: "sarthi",
      status: "pending",
      adminNotes: "",
    };

    /* ===============================
       2️⃣ REQUIRED FIELDS CHECK
    =============================== */
    const requiredFields = [
      "fullName",
      "phoneNumber",
      "password",
      "licenseNumber",
      "experienceYears",
      "preferredCity",
      "shiftPreference",
      "addressLine1",
      "state",
      "district",
      "pincode",
      "emergencyContact1",
      "emergencyRelation1",
    ];

    const missingFields = requiredFields.filter(
      (field) => !data[field] || data[field].trim() === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Required fields missing: ${missingFields.join(", ")}`,
      });
    }

    /* ===============================
       3️⃣ DUPLICATE CHECK
    =============================== */
    const exists = await Sarthi.findOne({
      phoneNumber: data.phoneNumber,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    /* ===============================
       4️⃣ HASH PASSWORD
    =============================== */
    data.password = await bcrypt.hash(data.password, 10);

    /* ===============================
       5️⃣ FILE UPLOADS (CORRECT FIELD NAMES)
    =============================== */
    const files = req.files || {};

    // Map frontend field names to backend field names
    const uploadMap = {
      profilePhoto: "profilePhoto",
      aadharFront: "aadharFront",
      aadharBack: "aadharBack",
      dlFront: "dlFront",
      dlBack: "dlBack",
      policeClearance: "policeClearance",
    };

    for (const [frontendField, backendField] of Object.entries(uploadMap)) {
      if (files[frontendField] && files[frontendField][0]) {
        console.log(`Uploading ${frontendField} to ${backendField}`);
        data[backendField] = await uploadToCloudinary(
          files[frontendField][0],
          "sarthi"
        );
      } else {
        console.log(`No file for ${frontendField}`);
      }
    }

    /* ===============================
       6️⃣ CREATE SARTHI
    =============================== */
    console.log("Creating sarthi with data:", {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      licenseNumber: data.licenseNumber,
      experienceYears: data.experienceYears,
      // Document URLs
      profilePhoto: data.profilePhoto ? "Yes" : "No",
      aadharFront: data.aadharFront ? "Yes" : "No",
      aadharBack: data.aadharBack ? "Yes" : "No",
      dlFront: data.dlFront ? "Yes" : "No",
      dlBack: data.dlBack ? "Yes" : "No",
    });

    const sarthi = await Sarthi.create(data);

    return res.status(201).json({
      success: true,
      message:
        "Sarthi registration submitted successfully. Verification pending.",
      sarthi: {
        _id: sarthi._id,
        fullName: sarthi.fullName,
        phoneNumber: sarthi.phoneNumber,
        email: sarthi.email,
        licenseNumber: sarthi.licenseNumber,
        experienceYears: sarthi.experienceYears,
        preferredCity: sarthi.preferredCity,
        shiftPreference: sarthi.shiftPreference,
        status: sarthi.status,
        // Document URLs
        profilePhoto: sarthi.profilePhoto,
        aadharFront: sarthi.aadharFront,
        aadharBack: sarthi.aadharBack,
        dlFront: sarthi.dlFront,
        dlBack: sarthi.dlBack,
        policeClearance: sarthi.policeClearance,
        // Other fields
        addressLine1: sarthi.addressLine1,
        state: sarthi.state,
        district: sarthi.district,
        createdAt: sarthi.createdAt,
      },
    });
  } catch (error) {
    console.error("SARTHI REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

/* =====================================================
   LOGIN SARTHI
===================================================== */
export const loginSarthi = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password required",
      });
    }

    const sarthi = await Sarthi.findOne({ phoneNumber });
    if (!sarthi) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, sarthi.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ❌ Pending sarthi
    if (sarthi.status === "pending") {
      return res.status(403).json({
        success: false,
        message:
          "Your profile is under verification. Please wait for admin approval.",
      });
    }

    // ❌ Rejected sarthi
    if (sarthi.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your profile has been rejected. Please contact support.",
      });
    }

    const token = jwt.sign(
      {
        id: sarthi._id,
        role: "sarthi",
        status: sarthi.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      sarthi,
    });
  } catch (error) {
    console.error("SARTHI LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/* =====================================================
   ADMIN – GET ALL SARTHIS
===================================================== */
export const getAllSarthis = async (req, res) => {
  try {
    const sarthis = await Sarthi.find({ role: "sarthi" }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      data: sarthis,
    });
  } catch (error) {
    console.error("GET SARTHIS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sarthis",
    });
  }
};

/* =====================================================
   ADMIN – GET SINGLE SARTHI
===================================================== */
export const getSarthiById = async (req, res) => {
  try {
    const sarthi = await Sarthi.findById(req.params.id);
    if (!sarthi) {
      return res.status(404).json({
        success: false,
        message: "Sarthi not found",
      });
    }

    return res.json({
      success: true,
      sarthi,
    });
  } catch (error) {
    console.error("GET SARTHI ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sarthi",
    });
  }
};

/* =====================================================
   ADMIN – APPROVE SARTHI
===================================================== */
export const approveSarthi = async (req, res) => {
  try {
    const sarthi = await Sarthi.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!sarthi) {
      return res.status(404).json({
        success: false,
        message: "Sarthi not found",
      });
    }

    return res.json({
      success: true,
      message: "Sarthi approved successfully",
      sarthi,
    });
  } catch (error) {
    console.error("APPROVE SARTHI ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

/* =====================================================
   ADMIN – REJECT SARTHI
===================================================== */
export const rejectSarthi = async (req, res) => {
  try {
    const sarthi = await Sarthi.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!sarthi) {
      return res.status(404).json({
        success: false,
        message: "Sarthi not found",
      });
    }

    return res.json({
      success: true,
      message: "Sarthi rejected",
      sarthi,
    });
  } catch (error) {
    console.error("REJECT SARTHI ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

/* =====================================================
   ADMIN – DELETE SARTHI
===================================================== */
export const deleteSarthi = async (req, res) => {
  try {
    const deleted = await Sarthi.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Sarthi not found",
      });
    }

    return res.json({
      success: true,
      message: "Sarthi deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SARTHI ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
