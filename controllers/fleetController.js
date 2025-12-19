import Fleet from "../models/Fleet.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =======================================================
// CLOUDINARY UPLOAD HELPER
// =======================================================
const uploadToCloudinary = async (file, folder = "fleet") => {
  try {
    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder,
    });
    return uploaded.secure_url;
  } catch (error) {
    console.error("Cloudinary Error:", error);
    return null;
  }
};

// =======================================================
// REGISTER FLEET OWNER
// =======================================================
export const registerFleet = async (req, res) => {
  try {
    let data = {
      ...req.body,
      category: "fleet",
    };

    const files = req.files;

    if (!data.password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (!data.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const uploadedFiles = {};

    if (files?.profilePhoto) {
      uploadedFiles.profilePhoto = await uploadToCloudinary(
        files.profilePhoto[0],
        "fleet/profile"
      );
    }

    if (files?.fleetDriversListFile) {
      uploadedFiles.fleetDriversListFile = await uploadToCloudinary(
        files.fleetDriversListFile[0],
        "fleet/drivers-list"
      );
    }

    let fleetVehicles = [];

    if (data.fleetVehiclesMeta) {
      const vehiclesMeta = JSON.parse(data.fleetVehiclesMeta);

      for (let meta of vehiclesMeta) {
        let rcUrl = null;
        let insuranceUrl = null;

        if (files && files[meta.rcKey]) {
          rcUrl = await uploadToCloudinary(
            files[meta.rcKey][0],
            "fleet/rc"
          );
        }

        if (files && files[meta.insuranceKey]) {
          insuranceUrl = await uploadToCloudinary(
            files[meta.insuranceKey][0],
            "fleet/insurance"
          );
        }

        fleetVehicles.push({
          vehicleNumber: meta.vehicleNumber,
          make: meta.make,
          model: meta.model,
          color: meta.color,
          seats: meta.seats,
          rcFile: rcUrl,
          insuranceFile: insuranceUrl,
        });
      }
    }

    const newFleet = await Fleet.create({
      ...data,
      ...uploadedFiles,
      fleetVehicles,
      password: hashedPassword,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Fleet registration successful. Pending admin approval.",
      fleet: newFleet,
    });
  } catch (error) {
    console.error("Fleet Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during fleet registration",
    });
  }
};

// =======================================================
// LOGIN FLEET OWNER
// =======================================================
export const loginFleet = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const fleet = await Fleet.findOne({ phoneNumber });
    if (!fleet) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, fleet.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (fleet.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          fleet.status === "pending"
            ? "Your fleet account is pending approval"
            : "Your fleet account has been rejected",
      });
    }

    const token = jwt.sign(
      { id: fleet._id, role: "fleet" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ success: true, fleet, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login error" });
  }
};

// =======================================================
// GET ALL FLEETS (ADMIN)
// =======================================================
export const getAllFleets = async (req, res) => {
  try {
    const fleets = await Fleet.find().sort({ createdAt: -1 });
    res.json({ success: true, fleets });
  } catch {
    res.status(500).json({ success: false });
  }
};

// =======================================================
// ✅ GET SINGLE FLEET BY ID (FIXED)
// =======================================================
export const getFleetById = async (req, res) => {
  try {
    const fleet = await Fleet.findById(req.params.id);

    if (!fleet) {
      return res.status(404).json({
        success: false,
        message: "Fleet not found",
      });
    }

    return res.json({
      success: true,
      fleet,
    });
  } catch (error) {
    console.error("Get Fleet By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch fleet",
    });
  }
};

// =======================================================
// APPROVE / REJECT / DELETE
// =======================================================
export const approveFleet = async (req, res) => {
  const fleet = await Fleet.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
  res.json({ success: true, fleet });
};

export const rejectFleet = async (req, res) => {
  const fleet = await Fleet.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
  res.json({ success: true, fleet });
};

export const deleteFleet = async (req, res) => {
  await Fleet.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
