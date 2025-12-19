import Partner from "../models/Partner.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =============================
   CLOUDINARY UPLOAD HELPER
============================= */
const uploadToCloudinary = async (file, folder = "partners") => {
  if (!file) return "";
  const result = await cloudinary.uploader.upload(file.path, { folder });
  return result.secure_url;
};

/* =============================
   REGISTER PARTNER
============================= */
export const registerPartner = async (req, res) => {
  try {
    const data = {
      ...req.body,
      category: "partner",
      role: "partner",
      status: "pending",
    };

    // required check
    if (!data.phoneNumber || !data.password || !data.fullName) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // duplicate phone check
    const exists = await Partner.findOne({ phoneNumber: data.phoneNumber });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // hash password
    data.password = await bcrypt.hash(data.password, 10);

    // FILE UPLOADS
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
        data[field] = await uploadToCloudinary(files[field][0]);
      }
    }

    const partner = await Partner.create(data);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Your profile will be verified within 24–48 hours.",
      partner,
    });
  } catch (err) {
    console.error("REGISTER PARTNER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/* =============================
   LOGIN PARTNER
============================= */
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

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ❌ BLOCK LOGIN UNTIL APPROVED
    if (partner.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          partner.status === "pending"
            ? "Your profile is under verification"
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
      token,
      partner,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/* =============================
   ADMIN — GET ALL PARTNERS
============================= */
export const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find({ category: "partner" }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      data: partners,
    });
  } catch (err) {
    console.error("GET PARTNERS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch partners",
    });
  }
};

/* =============================
   ADMIN — GET SINGLE PARTNER
============================= */
export const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    return res.json({ success: true, partner });
  } catch (err) {
    console.error("GET PARTNER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch partner",
    });
  }
};

/* =============================
   ADMIN — APPROVE PARTNER
============================= */
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
      message: "Partner approved successfully",
      partner,
    });
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

/* =============================
   ADMIN — REJECT PARTNER
============================= */
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
  } catch (err) {
    console.error("REJECT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

/* =============================
   ADMIN — DELETE PARTNER
============================= */
export const deletePartner = async (req, res) => {
  try {
    const deleted = await Partner.findByIdAndDelete(req.params.id);

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
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
