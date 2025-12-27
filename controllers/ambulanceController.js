// controllers/ambulanceController.js - COMPLETE FIXED VERSION
import Ambulance from "../models/Ambulance.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =====================================================
   CLOUDINARY UPLOAD HELPER
===================================================== */
const uploadToCloudinary = async (file, folder = "ambulance") => {
  if (!file) return "";
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Cloudinary upload error for ${folder}:`, error);
    return "";
  }
};

/* =====================================================
   REGISTER AMBULANCE SERVICE
===================================================== */
export const registerAmbulance = async (req, res) => {
  try {
    console.log("🔥 AMBULANCE REGISTRATION STARTED");
    console.log("📦 Request Body:", JSON.stringify(req.body, null, 2));
    console.log("📁 Files:", req.files ? Object.keys(req.files) : "No files");

    console.log("🔥 AMBULANCE REGISTRATION STARTED");
    console.log("📦 Request Body:", JSON.stringify(req.body, null, 2));
    console.log("📁 Files:", req.files ? Object.keys(req.files) : "No files");

    const data = {
      // Service Details
     serviceName: req.body.serviceName || "",
ownerName: req.body.ownerName || "",

      
      // Personal Details
      fullName: req.body.fullName || "",
      email: req.body.email || "",
      phoneNumber: req.body.phoneNumber || "",
      password: req.body.password || "",
      
      // Contact Details
      emergencyNumber: req.body.emergencyNumber || "",
      whatsappNumber: req.body.whatsappNumber || "",
      addressLine1: req.body.addressLine1 || "",
      addressLine2: req.body.addressLine2 || "",
      state: req.body.state || "",
      district: req.body.district || "",
      pincode: req.body.pincode || "",
      
      // Vehicle Details
      vehicleNumber: req.body.vehicleNumber || "",
      vehicleMake: req.body.vehicleMake || "",
      vehicleModel: req.body.vehicleModel || "",
      vehicleColor: req.body.vehicleColor || "",
      availableSeats: parseInt(req.body.availableSeats) || 0,
     features: req.body.features || "",

      vehiclePicture: "",
      
      // Emergency Contacts
      emergencyContact1: req.body.emergencyContact1 || "",
      emergencyRelation1: req.body.emergencyRelation1 || "",
      emergencyContact2: req.body.emergencyContact2 || "",
      emergencyRelation2: req.body.emergencyRelation2 || "",
      
      // Document fields
      profilePhoto: "",
      aadharFront: "",
      aadharBack: "",
      dlFront: "",
      dlBack: "",
      policeClearance: "",
      rcCertificate: "",
      fitnessCertificate: "",
      pollutionCertificate: "",
      insuranceCertificate: "",
      
      // System fields
      // Service Details
      serviceName: req.body.ambulanceServiceName || "",
      ownerName: req.body.ambulanceOwnerName || "",
      
      // Personal Details
      fullName: req.body.fullName || "",
      email: req.body.email || "",
      phoneNumber: req.body.phoneNumber || "",
      password: req.body.password || "",
      
      // Contact Details
      emergencyNumber: req.body.emergencyNumber || "",
      whatsappNumber: req.body.whatsappNumber || "",
      addressLine1: req.body.addressLine1 || "",
      addressLine2: req.body.addressLine2 || "",
      state: req.body.state || "",
      district: req.body.district || "",
      pincode: req.body.pincode || "",
      
      // Vehicle Details
      vehicleNumber: req.body.vehicleNumber || "",
      vehicleMake: req.body.vehicleMake || "",
      vehicleModel: req.body.vehicleModel || "",
      vehicleColor: req.body.vehicleColor || "",
      availableSeats: parseInt(req.body.availableSeats) || 0,
      features: req.body.ambulanceFeatures || "",
      vehiclePicture: "",
      
      // Emergency Contacts
      emergencyContact1: req.body.emergencyContact1 || "",
      emergencyRelation1: req.body.emergencyRelation1 || "",
      emergencyContact2: req.body.emergencyContact2 || "",
      emergencyRelation2: req.body.emergencyRelation2 || "",
      
      // Document fields
      profilePhoto: "",
      aadharFront: "",
      aadharBack: "",
      dlFront: "",
      dlBack: "",
      policeClearance: "",
      rcCertificate: "",
      fitnessCertificate: "",
      pollutionCertificate: "",
      insuranceCertificate: "",
      
      // System fields
      category: "ambulance",
      role: "ambulance",
      status: "pending",
      isApproved: false,
      availabilityStatus: "off-duty",
      adminNotes: "",
    };

    // Required fields validation
    const requiredFields = [
      "phoneNumber",
      "password",
      "fullName",
      "ownerName",
      "vehicleNumber",
      "serviceName",
      "addressLine1",
      "state",
      "district",
      "pincode",
      "emergencyContact1",
      "emergencyRelation1"
    ];

    const missingFields = requiredFields.filter(
      field => !data[field] || data[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      console.log("❌ Missing fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Required fields missing: ${missingFields.join(", ")}`,
        missing: missingFields
      });
    }

    if (!data.availableSeats || data.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid number of available seats",
        message: "Please enter valid number of available seats",
      });
    }

    // Duplicate check
    const exists = await Ambulance.findOne({
      phoneNumber: data.phoneNumber,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Hash password
    // Hash password
    data.password = await bcrypt.hash(data.password, 10);

    // File uploads
    // File uploads
    const files = req.files || {};
    const uploadMap = [
      { frontend: "profilePhoto", backend: "profilePhoto" },
      { frontend: "vehiclePicture", backend: "vehiclePicture" },
      { frontend: "aadharFront", backend: "aadharFront" },
      { frontend: "aadharBack", backend: "aadharBack" },
      { frontend: "dlFront", backend: "dlFront" },
      { frontend: "dlBack", backend: "dlBack" },
      { frontend: "policeClearance", backend: "policeClearance" },
      { frontend: "rcCertificate", backend: "rcCertificate" },
      { frontend: "fitnessCertificate", backend: "fitnessCertificate" },
      { frontend: "pollutionCertificate", backend: "pollutionCertificate" },
      { frontend: "insuranceCertificate", backend: "insuranceCertificate" },
      { frontend: "profilePhoto", backend: "profilePhoto" },
      { frontend: "vehiclePicture", backend: "vehiclePicture" },
      { frontend: "aadharFront", backend: "aadharFront" },
      { frontend: "aadharBack", backend: "aadharBack" },
      { frontend: "dlFront", backend: "dlFront" },
      { frontend: "dlBack", backend: "dlBack" },
      { frontend: "policeClearance", backend: "policeClearance" },
      { frontend: "rcCertificate", backend: "rcCertificate" },
      { frontend: "fitnessCertificate", backend: "fitnessCertificate" },
      { frontend: "pollutionCertificate", backend: "pollutionCertificate" },
      { frontend: "insuranceCertificate", backend: "insuranceCertificate" },
    ];

    for (const mapping of uploadMap) {
      if (files[mapping.frontend] && files[mapping.frontend][0]) {
        try {
          data[mapping.backend] = await uploadToCloudinary(
            files[mapping.frontend][0],
            "ambulance"
          );
        } catch (uploadErr) {
          console.error(`❌ Upload failed for ${mapping.frontend}:`, uploadErr);
          data[mapping.backend] = "";
        }
      }
    }

    // Create ambulance
    console.log("💾 Saving to database...");
    const ambulance = await Ambulance.create(data);
    console.log("✅ Ambulance created with ID:", ambulance._id);

    return res.status(201).json({
      success: true,
      message: "Ambulance registration submitted successfully. Your KYC will be verified within 24 hours.",
      ambulance: {
        _id: ambulance._id,
        serviceName: ambulance.serviceName,
        ownerName: ambulance.ownerName,
        fullName: ambulance.fullName,
        phoneNumber: ambulance.phoneNumber,
        vehicleNumber: ambulance.vehicleNumber,
        availableSeats: ambulance.availableSeats,
        status: ambulance.status,
        createdAt: ambulance.createdAt
      },
    });
  } catch (error) {
    console.error("❌ AMBULANCE REGISTER ERROR:", error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Server error during ambulance registration",
      error: error.message,
    });
  }
};

/* =====================================================
   LOGIN AMBULANCE
===================================================== */
export const loginAmbulance = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password required",
      });
    }

    const ambulance = await Ambulance.findOne({ phoneNumber }).select('+password');
    
    if (!ambulance) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    const isMatch = await bcrypt.compare(password, ambulance.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    if (ambulance.status === "pending") {
      return res.status(403).json({
        success: false,
        message: "Your KYC is under verification. Our team will contact you within 24 hours.",
        status: "pending"
      });
    }

    if (ambulance.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your KYC has been rejected. Please contact support for more details.",
        status: "rejected"
      });
    }

    if (ambulance.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Account not approved. Please contact support.",
        status: ambulance.status
      });
    }

    if (ambulance.status === "approved") {
      ambulance.isApproved = true;
      await ambulance.save();
    }

    const token = jwt.sign(
      {
        id: ambulance._id,
        role: "ambulance",
        status: ambulance.status,
        phoneNumber: ambulance.phoneNumber
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const ambulanceData = ambulance.toObject();
    delete ambulanceData.password;

    return res.json({
      success: true,
      message: "Login successful",
      token,
      ambulance: ambulanceData,
      status: ambulance.status
    });
  } catch (error) {
    console.error("AMBULANCE LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message
    });
  }
};

/* =====================================================
   ADMIN – GET ALL AMBULANCES
===================================================== */
export const getAllAmbulances = async (req, res) => {
  try {
    // ✅ LIST (table / charts ke liye)
    const ambulances = await Ambulance.find({
      role: "ambulance",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    // 🔥 REAL COUNT (dashboard ke liye)
    const totalAmbulances = await Ambulance.countDocuments({
      role: "ambulance",
    });

    return res.json({
      success: true,
      data: ambulances,            // list
      ambulances: ambulances,      // backward compatibility
      total: totalAmbulances       // 👈 IMPORTANT (dashboard use karega)
    });
  } catch (error) {
    console.error("GET AMBULANCES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ambulances",
      error: error.message
    });
  }
};

/* =====================================================
   ADMIN – GET SINGLE AMBULANCE
===================================================== */
export const getAmbulanceById = async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id).select('-password');
    
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    return res.json({
      success: true,
      ambulance, // ✅ CORRECT FORMAT
      data: ambulance,
    });
  } catch (error) {
    console.error("GET AMBULANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ambulance",
      error: error.message
    });
  }
};

/* =====================================================
   ADMIN – APPROVE AMBULANCE ✅ FIXED
===================================================== */
export const approveAmbulance = async (req, res) => {
  try {
    console.log("✅ Approving ambulance:", req.params.id);
    
    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        isApproved: true,
        availabilityStatus: "available",
        adminNotes: req.body.adminNotes || "Ambulance service approved"
      },
      { new: true }
    ).select('-password');

    if (!ambulance) {
      console.log("❌ Ambulance not found:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    console.log("✅ Ambulance approved successfully:", ambulance._id);

    return res.json({
      success: true,
      message: "Ambulance service approved successfully",
      ambulance, // ✅ IMPORTANT: Frontend expects this
      data: ambulance,
    });
  } catch (error) {
    console.error("❌ APPROVE AMBULANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Approval failed",
      error: error.message
    });
  }
};

/* =====================================================
   ADMIN – REJECT AMBULANCE ✅ FIXED
===================================================== */
export const rejectAmbulance = async (req, res) => {
  try {
    console.log("⛔ Rejecting ambulance:", req.params.id);
    
    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        isApproved: false,
        availabilityStatus: "off-duty",
        adminNotes: req.body.adminNotes || "Ambulance service rejected"
      },
      { new: true }
    ).select('-password');

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    console.log("✅ Ambulance rejected:", ambulance._id);

    return res.json({
      success: true,
      message: "Ambulance service rejected",
      ambulance, // ✅ IMPORTANT: Frontend expects this
      data: ambulance,
    });
  } catch (error) {
    console.error("❌ REJECT AMBULANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Rejection failed",
      error: error.message
    });
  }
};

/* =====================================================
   UPDATE AMBULANCE AVAILABILITY ✅ FIXED
===================================================== */
export const updateAmbulanceStatus = async (req, res) => {
  try {
    const { availabilityStatus } = req.body;
    const validStatuses = ["available", "on-duty", "off-duty"];

    if (!validStatuses.includes(availabilityStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use 'available', 'on-duty', or 'off-duty'",
      });
    }

    console.log(`🔄 Updating status for ${req.params.id} to ${availabilityStatus}`);

    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      { availabilityStatus },
      { new: true }
    ).select('-password');

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    console.log("✅ Status updated:", ambulance._id);

    return res.json({
      success: true,
      message: `Ambulance is now ${availabilityStatus}`,
      ambulance, // ✅ IMPORTANT: Frontend expects this
      data: ambulance,
    });
  } catch (error) {
    console.error("❌ UPDATE AMBULANCE STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Status update failed",
      error: error.message
    });
  }
};

/* =====================================================
   ADMIN – DELETE AMBULANCE ✅ FIXED
===================================================== */
export const deleteAmbulance = async (req, res) => {
  try {
    console.log("🗑️ Deleting ambulance:", req.params.id);
    
    const deleted = await Ambulance.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    console.log("✅ Ambulance deleted:", deleted._id);

    return res.json({
      success: true,
      message: "Ambulance service deleted successfully",
      deletedId: deleted._id,
    });
  } catch (error) {
    console.error("❌ DELETE AMBULANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message
    });
  }
};

/* =====================================================
   GET AMBULANCE PROFILE
===================================================== */
export const getAmbulanceProfile = async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id).select('-password');
    
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    return res.json({
      success: true,
      ambulance,
      data: ambulance,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

/* =====================================================
   UPDATE AMBULANCE PROFILE
===================================================== */
export const updateAmbulanceProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    delete updateData.password;
    delete updateData.status;
    delete updateData.isApproved;
    delete updateData.role;
    delete updateData.category;

    if (updateData.availableSeats) {
      updateData.availableSeats = parseInt(updateData.availableSeats) || 0;
    }

    const files = req.files || {};
    const uploadMap = ["profilePhoto", "vehiclePicture"];

    for (const field of uploadMap) {
      if (files[field]?.[0]) {
        updateData[field] = await uploadToCloudinary(files[field][0], "ambulance");
      }
    }

    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      ambulance,
      data: ambulance,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error.message
    });
  }
};