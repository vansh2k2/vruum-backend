import Driver from "../models/Driver.js";
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
    let data = {
      ...req.body,
      category: "driver",
    };

    if (!data.password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

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

    const newDriver = await Driver.create({
      ...data,
      ...uploadedFiles,
      password: hashedPassword,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Driver registration successful. Pending admin approval.",
      driver: newDriver,
    });
  } catch (error) {
    console.error("Driver Register Error:", error);
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
        message: "Phone number & password required",
      });
    }

    const driver = await Driver.findOne({ phoneNumber });

    if (!driver) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    if (driver.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          driver.status === "pending"
            ? "Your profile is pending approval"
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
    console.error("Driver Login Error:", error);
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
    const drivers = await Driver.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      drivers,
    });
  } catch (error) {
    console.error("Get Drivers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch drivers",
    });
  }
};

// =============================
// ADMIN — APPROVE DRIVER
// =============================
export const approveDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
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
    console.error("Approve Driver Error:", error);
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
    const driver = await Driver.findByIdAndUpdate(
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
    console.error("Reject Driver Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject driver",
    });
  }
};
