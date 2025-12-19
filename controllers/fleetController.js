import Partner from "../models/Partner.js";  // ✅ CORRECT
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
    const data = {
      ...req.body,
      category: "fleet",      // ✅ Set category
      role: "fleet",          // ✅ Set role
      status: "pending",
    };

    const files = req.files;

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

    // ✅ Use Partner model
    const newFleet = await Partner.create({
      ...data,
      ...uploadedFiles,
      fleetVehicles,
    });

    return res.status(201).json({
      success: true,
      message: "Fleet registration successful. Your profile will be verified within 24-48 hours.",
      fleet: newFleet,
    });
  } catch (error) {
    console.error("FLEET REGISTER ERROR:", error);
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

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password required",
      });
    }

    // ✅ Filter by category
    const fleet = await Partner.findOne({ 
      phoneNumber,
      category: "fleet" 
    });

    if (!fleet) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const isMatch = await bcrypt.compare(password, fleet.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    if (fleet.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          fleet.status === "pending"
            ? "Your fleet account is under verification"
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
    console.error("FLEET LOGIN ERROR:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Login error" 
    });
  }
};

// =======================================================
// GET ALL FLEETS (ADMIN)
// =======================================================
export const getAllFleets = async (req, res) => {
  try {
    // ✅ Filter by category
    const fleets = await Partner.find({ category: "fleet" })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: fleets });
  } catch (error) {
    console.error("GET FLEETS ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch fleets"
    });
  }
};

// =======================================================
// GET SINGLE FLEET BY ID
// =======================================================
export const getFleetById = async (req, res) => {
  try {
    const fleet = await Partner.findById(req.params.id);

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
    console.error("GET FLEET BY ID ERROR:", error);
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
  try {
    const fleet = await Partner.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!fleet) {
      return res.status(404).json({
        success: false,
        message: "Fleet not found"
      });
    }

    res.json({ success: true, fleet });
  } catch (error) {
    console.error("APPROVE FLEET ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Approval failed"
    });
  }
};

export const rejectFleet = async (req, res) => {
  try {
    const fleet = await Partner.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!fleet) {
      return res.status(404).json({
        success: false,
        message: "Fleet not found"
      });
    }

    res.json({ success: true, fleet });
  } catch (error) {
    console.error("REJECT FLEET ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Rejection failed"
    });
  }
};

export const deleteFleet = async (req, res) => {
  try {
    const deleted = await Partner.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Fleet not found"
      });
    }

    res.json({ 
      success: true,
      message: "Fleet deleted successfully"
    });
  } catch (error) {
    console.error("DELETE FLEET ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
};