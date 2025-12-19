import Ambulance from "../models/Ambulance.js";
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
    const data = req.body;
    const files = req.files;

    if (!data.password) {
      return res.status(400).json({ success: false, message: "Password required" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

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

    const ambulance = await Ambulance.create({
      ...data,
      ...uploaded,
      password: hashedPassword,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Ambulance registration submitted. Pending approval.",
      ambulance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// ================= LOGIN =================
export const loginAmbulance = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const ambulance = await Ambulance.findOne({ phoneNumber });
  if (!ambulance) {
    return res.status(400).json({ success: false, message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, ambulance.password);
  if (!match) {
    return res.status(400).json({ success: false, message: "Invalid credentials" });
  }

  if (ambulance.status !== "approved") {
    return res.status(403).json({
      success: false,
      message:
        ambulance.status === "pending"
          ? "Profile pending approval"
          : "Profile rejected",
    });
  }

  const token = jwt.sign(
    { id: ambulance._id, role: "ambulance" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ success: true, ambulance, token });
};

// ================= ADMIN =================
export const getAllAmbulances = async (req, res) => {
  const list = await Ambulance.find().sort({ createdAt: -1 });
  res.json({ success: true, ambulances: list });
};

export const approveAmbulance = async (req, res) => {
  const data = await Ambulance.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  res.json({ success: true, data });
};

export const rejectAmbulance = async (req, res) => {
  const data = await Ambulance.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );
  res.json({ success: true, data });
};
