import Partner from "../models/Partner.js";  // ✅ CORRECT
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const uploadToCloudinary = async (file) => {
  try {
    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "drivers",
    });
    return uploaded.secure_url;
  } catch (error) {
    console.error("Cloudinary Error:", error);
    return null;
  }
};

// =============================
// REGISTER DRIVER (SARTHI)
// =============================
export const registerDriver = async (req, res) => {
  try {
    const data = {
      ...req.body,
      category: "driver",      // ✅ Set category
      role: "driver",          // ✅ Set role
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

    const uploadedFiles = {};
    const uploadFields = [
      "profilePhoto",
      "aadharFront",
      "aadharBack",
      "dlFront",
      "dlBack",
      "policeClearance",
    ];

    for (const field of uploadFields) {
      if (req.files && req.files[field]) {
        const url = await uploadToCloudinary(req.files[field][0]);
        uploadedFiles[field] = url;
      }
    }

    // ✅ Use Partner model
    const newDriver = await Partner.create({
      ...data,
      ...uploadedFiles,
    });

    return res.status(201).json({
      success: true,
      message: "Driver registration successful. Your profile will be verified within 24-48 hours.",
      driver: newDriver,
    });
  } catch (error) {
    console.error("DRIVER REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during driver registration",
    });
  }
};

// =============================
// LOGIN DRIVER
// =============================
export const loginDriver = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password required",
      });
    }

    // ✅ Filter by category
    const driver = await Partner.findOne({ 
      phoneNumber,
      category: "driver" 
    });

    if (!driver) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (driver.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          driver.status === "pending"
            ? "Your profile is under verification"
            : "Your profile has been rejected",
      });
    }

    const token = jwt.sign(
      { id: driver._id, role: "driver" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      driver,
      token,
    });
  } catch (error) {
    console.error("DRIVER LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// =============================
// ADMIN — GET ALL DRIVERS
// =============================
export const getAllDrivers = async (req, res) => {
  try {
    // ✅ Filter by category
    const drivers = await Partner.find({ category: "driver" })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: drivers,
    });
  } catch (error) {
    console.error("GET DRIVERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch drivers",
    });
  }
};

// =============================
// ADMIN — GET SINGLE DRIVER
// =============================
export const getDriverById = async (req, res) => {
  try {
    const driver = await Partner.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    return res.json({
      success: true,
      driver,
    });
  } catch (error) {
    console.error("GET DRIVER BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch driver",
    });
  }
};

// =============================
// ADMIN — APPROVE DRIVER
// =============================
export const approveDriver = async (req, res) => {
  try {
    const driver = await Partner.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    return res.json({
      success: true,
      message: "Driver approved",
      driver,
    });
  } catch (error) {
    console.error("APPROVE DRIVER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve driver",
    });
  }
};

// =============================
// ADMIN — REJECT DRIVER
// =============================
export const rejectDriver = async (req, res) => {
  try {
    const driver = await Partner.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    return res.json({
      success: true,
      message: "Driver rejected",
      driver,
    });
  } catch (error) {
    console.error("REJECT DRIVER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject driver",
    });
  }
};

// =============================
// ADMIN — DELETE DRIVER
// =============================
export const deleteDriver = async (req, res) => {
  try {
    const deleted = await Partner.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    return res.json({
      success: true,
      message: "Driver deleted successfully",
    });
  } catch (error) {
    console.error("DELETE DRIVER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};