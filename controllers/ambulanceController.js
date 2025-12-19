import Partner from "../models/Partner.js";  // ✅ Change this
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const uploadToCloudinary = async (file) => {
  const res = await cloudinary.uploader.upload(file.path, {
    folder: "ambulance",
  });
  return res.secure_url;
};

// ================= REGISTER =================
export const registerAmbulance = async (req, res) => {
  try {
    const data = {
      ...req.body,
      category: "ambulance",  // ✅ Add this
      role: "ambulance",      // ✅ Add this
      status: "pending",
    };
    
    const files = req.files;

    if (!data.password || !data.fullName || !data.phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Required fields missing" 
      });
    }

    // ✅ Check duplicate
    const exists = await Partner.findOne({ phoneNumber: data.phoneNumber });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

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

    const uploaded = {};
    for (const field of uploadFields) {
      if (files && files[field]) {
        uploaded[field] = await uploadToCloudinary(files[field][0]);
      }
    }

    const ambulance = await Partner.create({  // ✅ Use Partner model
      ...data,
      ...uploaded,
    });

    res.status(201).json({
      success: true,
      message: "Ambulance registration submitted. Your profile will be verified within 24-48 hours.",
      ambulance,
    });
  } catch (err) {
    console.error("AMBULANCE REGISTER ERROR:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// ================= LOGIN =================
export const loginAmbulance = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone number and password required" 
      });
    }

    const ambulance = await Partner.findOne({ 
      phoneNumber,
      category: "ambulance"  // ✅ Filter by category
    });
    
    if (!ambulance) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const match = await bcrypt.compare(password, ambulance.password);
    if (!match) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    if (ambulance.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          ambulance.status === "pending"
            ? "Your profile is under verification"
            : "Your profile has been rejected",
      });
    }

    const token = jwt.sign(
      { id: ambulance._id, role: "ambulance" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, ambulance, token });
  } catch (err) {
    console.error("AMBULANCE LOGIN ERROR:", err);
    res.status(500).json({ 
      success: false, 
      message: "Login failed" 
    });
  }
};

// ================= ADMIN =================
export const getAllAmbulances = async (req, res) => {
  try {
    const list = await Partner.find({ category: "ambulance" })  // ✅ Filter by category
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: list });
  } catch (err) {
    console.error("GET AMBULANCES ERROR:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch ambulances" 
    });
  }
};

export const approveAmbulance = async (req, res) => {
  try {
    const data = await Partner.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found"
      });
    }
    
    res.json({ success: true, data });
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ 
      success: false, 
      message: "Approval failed" 
    });
  }
};

export const rejectAmbulance = async (req, res) => {
  try {
    const data = await Partner.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found"
      });
    }
    
    res.json({ success: true, data });
  } catch (err) {
    console.error("REJECT ERROR:", err);
    res.status(500).json({ 
      success: false, 
      message: "Rejection failed" 
    });
  }
};

export const deleteAmbulance = async (req, res) => {
  try {
    const deleted = await Partner.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found"
      });
    }
    
    res.json({ 
      success: true, 
      message: "Ambulance deleted successfully" 
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ 
      success: false, 
      message: "Delete failed" 
    });
  }
};