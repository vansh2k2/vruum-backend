import { Fleet, FleetVehicle } from "../models/Fleet.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =====================================================
   CLOUDINARY UPLOAD HELPER
===================================================== */
const uploadToCloudinary = async (file, folder = "fleet") => {
  if (!file) return "";
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return "";
  }
};

/* =====================================================
   NORMALIZE FILES (SUPPORTS upload.any())
===================================================== */
const normalizeFiles = (filesInput) => {
  if (!filesInput) return {};

  if (Array.isArray(filesInput)) {
    const files = {};
    filesInput.forEach((file) => {
      if (!files[file.fieldname]) files[file.fieldname] = [];
      files[file.fieldname].push(file);
    });
    return files;
  }

  return filesInput;
};

/* =====================================================
   REGISTER FLEET OWNER
===================================================== */
export const registerFleet = async (req, res) => {
  try {
    console.log("🚛 FLEET REGISTRATION STARTED");

    const data = {
      ...req.body,
      category: "fleet",
      role: "fleet",
      status: "pending",
      isApproved: false,
    };

    const requiredFields = [
      "phoneNumber",
      "password",
      "fullName",
      "addressLine1",
      "state",
      "district",
      "pincode",
      "numberOfVehicles",
      "emergencyContact1",
      "emergencyRelation1",
    ];

    const missing = requiredFields.filter((field) => !data[field]);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
        missing,
      });
    }

    const exists = await Fleet.findOne({ phoneNumber: data.phoneNumber });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered as fleet owner",
      });
    }

    data.password = await bcrypt.hash(data.password, 10);

    const files = normalizeFiles(req.files);

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
        data[field] = await uploadToCloudinary(files[field][0], "fleet/owner");
      }
    }

    const fleet = await Fleet.create(data);

    let vehiclesMeta = [];
    if (req.body.fleetVehiclesMeta) {
      try {
        vehiclesMeta = JSON.parse(req.body.fleetVehiclesMeta);
      } catch (err) {
        console.error("❌ Invalid fleetVehiclesMeta JSON:", err);
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
          color: meta.color || "",
          seats: meta.seats || 4,
          status: "active"
        };

        const rcFieldName = `fleetVehicle_rc_${i}`;
        if (files[rcFieldName]?.[0]) {
          vehicle.rcFile = await uploadToCloudinary(
            files[rcFieldName][0],
            "fleet/vehicles/rc"
          );
        }

        const insFieldName = `fleetVehicle_insurance_${i}`;
        if (files[insFieldName]?.[0]) {
          vehicle.insuranceFile = await uploadToCloudinary(
            files[insFieldName][0],
            "fleet/vehicles/insurance"
          );
        }

        await FleetVehicle.create(vehicle);
      }
    }

    return res.status(201).json({
      success: true,
      message:
        "Fleet registration submitted successfully. Admin verification pending.",
      fleet: {
        id: fleet._id,
        fullName: fleet.fullName,
        phoneNumber: fleet.phoneNumber,
        status: fleet.status,
        numberOfVehicles: fleet.numberOfVehicles,
      },
    });
  } catch (error) {
    console.error("💥 FLEET REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during fleet registration",
      error: error.message,
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

    // ❌ REJECTED → LOGIN BLOCK
    if (fleet.status === "rejected") {
      return res.status(403).json({
        success: false,
        status: "rejected",
        message: "Your fleet account has been rejected by admin",
      });
    }

    // ⏳ PENDING → LOGIN BLOCK
    if (fleet.status !== "approved" || !fleet.isApproved) {
      return res.status(403).json({
        success: false,
        status: "pending",
        message: "Your fleet account is under verification",
      });
    }

    // ✅ APPROVED → LOGIN ALLOWED
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
    console.error("💥 FLEET LOGIN ERROR:", error);
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
    console.error("💥 GET FLEETS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch fleets",
    });
  }
};

/* =====================================================
   ADMIN – GET SINGLE FLEET WITH VEHICLES
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
    console.error("💥 GET FLEET ERROR:", error);
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
      { 
        status: "approved", 
        isApproved: true,
        adminNotes: "Application approved by admin"
      },
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
      message: "Fleet approved successfully. They can now login.",
      fleet,
    });
  } catch (error) {
    console.error("💥 APPROVE FLEET ERROR:", error);
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
    const { adminNotes } = req.body;

    const fleet = await Fleet.findByIdAndUpdate(
      req.params.id,
      { 
        status: "rejected", 
        isApproved: false,
        adminNotes: adminNotes || "Application rejected by admin"
      },
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
    console.error("💥 REJECT FLEET ERROR:", error);
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
      message: "Fleet and all associated vehicles deleted successfully",
    });
  } catch (error) {
    console.error("💥 DELETE FLEET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};