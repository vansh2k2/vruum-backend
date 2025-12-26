import Partner from "../models/Partner.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =====================================================
   CLOUDINARY UPLOAD HELPER
===================================================== */
const uploadToCloudinary = async (file, folder = "partners") => {
  if (!file) return "";
  const result = await cloudinary.uploader.upload(file.path, {
    folder,
  });
  return result.secure_url;
};

/* =====================================================
   REGISTER PARTNER
===================================================== */
export const registerPartner = async (req, res) => {
  try {
    const data = {
      ...req.body,
      category: "partner",
      role: "partner",
      status: "pending",          // admin verification
      isApproved: false,          // 🔥 IMPORTANT
      availabilityStatus: "offline", // future ready
    };

    /* ---------- REQUIRED FIELDS ---------- */
    if (!data.phoneNumber || !data.password || !data.fullName) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    /* ---------- DUPLICATE CHECK ---------- */
    const exists = await Partner.findOne({
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
          "partners"
        );
      }
    }

    const partner = await Partner.create(data);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Your profile will be verified within 24–48 hours.",
      partner,
    });
  } catch (error) {
    console.error("REGISTER PARTNER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/* =====================================================
   LOGIN PARTNER (ADMIN APPROVAL REQUIRED)
===================================================== */
export const loginPartner = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password required",
      });
    }

    const partner = await Partner.findOne({ phoneNumber });
    if (!partner) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      partner.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!partner.isApproved) {
      return res.status(403).json({
        success: false,
        message:
          "Your profile is under verification. Our team will contact you soon.",
      });
    }

    const token = jwt.sign(
      {
        id: partner._id,
        role: "partner",
        status: partner.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      partner,
    });
  } catch (error) {
    console.error("LOGIN PARTNER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/* =====================================================
   ADMIN – GET ALL PARTNERS
===================================================== */
export const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find({
      role: "partner",
    }).sort({ createdAt: -1 });

    // 🔥 REAL COUNT (DB SE)
    const totalPartners = await Partner.countDocuments({
      role: "partner",
    });

    return res.json({
      success: true,
      data: partners,      // list (table ke liye)
      total: totalPartners // 👈 dashboard count ke liye
    });
  } catch (error) {
    console.error("GET PARTNERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch partners",
    });
  }
};


/* =====================================================
   ADMIN – GET SINGLE PARTNER
===================================================== */
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
    console.error("GET PARTNER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch partner",
    });
  }
};

/* =====================================================
   ADMIN – APPROVE PARTNER
===================================================== */
export const approvePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        isApproved: true,
      },
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
      message: "Partner approved successfully",
      partner,
    });
  } catch (error) {
    console.error("APPROVE PARTNER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

/* =====================================================
   ADMIN – REJECT PARTNER
===================================================== */
export const rejectPartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        isApproved: false,
      },
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
    console.error("REJECT PARTNER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

/* =====================================================
   ADMIN – DELETE PARTNER
===================================================== */
export const deletePartner = async (req, res) => {
  try {
    const deleted = await Partner.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
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
    console.error("DELETE PARTNER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
