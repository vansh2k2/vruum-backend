import Fleet from "../models/Fleet.js";
import { FleetVehicle } from "../models/Fleet.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =====================================================
   CLOUDINARY UPLOAD HELPER
===================================================== */
const uploadToCloudinary = async (file, folder = "fleet") => {
  if (!file) return "";
  const result = await cloudinary.uploader.upload(file.path, {
    folder,
  });
  return result.secure_url;
};

/* =====================================================
   NORMALIZE FILES (SUPPORTS upload.any() & upload.fields())
===================================================== */
const normalizeFiles = (filesInput) => {
  if (!filesInput) return {};

  // upload.any() → array
  if (Array.isArray(filesInput)) {
    const files = {};
    filesInput.forEach((file) => {
      if (!files[file.fieldname]) files[file.fieldname] = [];
      files[file.fieldname].push(file);
    });
    return files;
  }

  // upload.fields() → already object
  return filesInput;
};

/* =====================================================
   REGISTER FLEET OWNER
===================================================== */
export const registerFleet = async (req, res) => {
  try {
    const data = {
      ...req.body,
      category: "fleet",
      role: "fleet",
      status: "pending",
      isApproved: false,
    };

    /* ---------- REQUIRED FIELDS ---------- */
    if (!data.phoneNumber || !data.password || !data.fullName) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    /* ---------- DUPLICATE CHECK ---------- */
    const exists = await Fleet.findOne({ phoneNumber: data.phoneNumber });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    /* ---------- HASH PASSWORD ---------- */
    data.password = await bcrypt.hash(data.password, 10);

    /* ---------- FILE NORMALIZATION ---------- */
    const files = normalizeFiles(req.files);

    /* ---------- STATIC FILE UPLOADS ---------- */
    const uploadMap = [
      "profilePhoto",
      "driversListFile",
      "aadharFront",
      "aadharBack",
      "dlFront",
      "dlBack",
      "policeClearance",
    ];

    for (const field of uploadMap) {
      if (files[field]?.[0]) {
        data[field] = await uploadToCloudinary(files[field][0], "fleet");
      }
    }

    /* ---------- SAVE FLEET OWNER ---------- */
    const fleet = await Fleet.create(data);

    /* ---------- SAVE FLEET VEHICLES ---------- */
    let vehiclesMeta = [];

    if (req.body.fleetVehiclesMeta) {
      try {
        vehiclesMeta = JSON.parse(req.body.fleetVehiclesMeta);
      } catch (err) {
        console.error("Invalid fleetVehiclesMeta JSON");
        vehiclesMeta = [];
      }
    }

    if (vehiclesMeta.length > 0) {
      for (let i = 0; i < vehiclesMeta.length; i++) {
        const meta = vehiclesMeta[i];

        const vehicle = {
          fleetId: fleet._id,
          vehicleNumber: meta.vehicleNumber,
          make: meta.make,
          model: meta.model,
          color: meta.color,
          seats: meta.seats,
        };

        // 🚗 RC FILE
        if (files[`fleetVehicle_rc_${i}`]?.[0]) {
          vehicle.rcFile = await uploadToCloudinary(
            files[`fleetVehicle_rc_${i}`][0],
            "fleet/vehicles"
          );
        }

        // 🛡️ INSURANCE FILE
        if (files[`fleetVehicle_insurance_${i}`]?.[0]) {
          vehicle.insuranceFile = await uploadToCloudinary(
            files[`fleetVehicle_insurance_${i}`][0],
            "fleet/vehicles"
          );
        }

        await FleetVehicle.create(vehicle);
      }
    }

    return res.status(201).json({
      success: true,
      message:
        "Fleet registration submitted successfully. Admin verification pending.",
      fleet,
    });
  } catch (error) {
    console.error("FLEET REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during fleet registration",
    });
  }
};

/* =====================================================
   LOGIN FLEET OWNER
===================================================== */
export const loginFleet = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password required",
      });
    }

    const fleet = await Fleet.findOne({ phoneNumber });
    if (!fleet) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, fleet.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!fleet.isApproved) {
      return res.status(403).json({
        success: false,
        message:
          "Your profile is under verification. Our team will contact you soon.",
      });
    }

    const token = jwt.sign(
      {
        id: fleet._id,
        role: "fleet",
        status: fleet.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      fleet,
    });
  } catch (error) {
    console.error("FLEET LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/* =====================================================
   ADMIN – GET ALL FLEETS
===================================================== */
export const getAllFleets = async (req, res) => {
  try {
    const fleets = await Fleet.find({ role: "fleet" }).sort({
      createdAt: -1,
    });

    const fleetsWithCount = await Promise.all(
      fleets.map(async (fleet) => {
        const vehicleCount = await FleetVehicle.countDocuments({
          fleetId: fleet._id,
        });

        return {
          ...fleet.toObject(),
          vehicleCount,
        };
      })
    );

    return res.json({
      success: true,
      data: fleetsWithCount,
    });
  } catch (error) {
    console.error("GET FLEETS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch fleets",
    });
  }
};

/* =====================================================
   ADMIN – GET SINGLE FLEET
===================================================== */
export const getFleetById = async (req, res) => {
  try {
    const fleet = await Fleet.findById(req.params.id);
    if (!fleet) {
      return res.status(404).json({
        success: false,
        message: "Fleet not found",
      });
    }

    const vehicles = await FleetVehicle.find({ fleetId: fleet._id });

    return res.json({
      success: true,
      fleet,
      vehicles,
    });
  } catch (error) {
    console.error("GET FLEET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch fleet",
    });
  }
};

/* =====================================================
   ADMIN – APPROVE FLEET
===================================================== */
export const approveFleet = async (req, res) => {
  try {
    const fleet = await Fleet.findByIdAndUpdate(
      req.params.id,
      { status: "approved", isApproved: true },
      { new: true }
    );

    if (!fleet) {
      return res.status(404).json({
        success: false,
        message: "Fleet not found",
      });
    }

    return res.json({
      success: true,
      message: "Fleet approved successfully",
      fleet,
    });
  } catch (error) {
    console.error("APPROVE FLEET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

/* =====================================================
   ADMIN – REJECT FLEET
===================================================== */
export const rejectFleet = async (req, res) => {
  try {
    const fleet = await Fleet.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", isApproved: false },
      { new: true }
    );

    if (!fleet) {
      return res.status(404).json({
        success: false,
        message: "Fleet not found",
      });
    }

    return res.json({
      success: true,
      message: "Fleet rejected successfully",
      fleet,
    });
  } catch (error) {
    console.error("REJECT FLEET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

/* =====================================================
   ADMIN – DELETE FLEET
===================================================== */
export const deleteFleet = async (req, res) => {
  try {
    const deleted = await Fleet.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Fleet not found",
      });
    }

    await FleetVehicle.deleteMany({ fleetId: deleted._id });

    return res.json({
      success: true,
      message: "Fleet and vehicles deleted successfully",
    });
  } catch (error) {
    console.error("DELETE FLEET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
