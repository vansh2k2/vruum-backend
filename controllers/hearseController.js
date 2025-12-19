import Hearse from "../models/Hearse.js";
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
    let data = {
      ...req.body,
      category: "hearse",
    };

    if (!data.password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

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

    const hearse = await Hearse.create({
      ...data,
      ...uploadedFiles,
      password: hashedPassword,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Hearse registration successful. Pending admin approval.",
      hearse,
    });
  } catch (error) {
    console.error("Hearse Register Error:", error);
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

    const hearse = await Hearse.findOne({ phoneNumber });
    if (!hearse) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, hearse.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (hearse.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          hearse.status === "pending"
            ? "Your profile is pending approval"
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
    console.error("Hearse Login Error:", error);
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
    const list = await Hearse.find().sort({ createdAt: -1 });
    res.json({ success: true, hearse: list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch hearse" });
  }
};

// =============================
// ADMIN: APPROVE / REJECT
// =============================
export const approveHearse = async (req, res) => {
  const hearse = await Hearse.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  res.json({ success: true, hearse });
};

export const rejectHearse = async (req, res) => {
  const hearse = await Hearse.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );
  res.json({ success: true, hearse });
};
