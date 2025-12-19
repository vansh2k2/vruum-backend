// =======================================================
// FLEET MODEL
// File: models/Fleet.js
// =======================================================

import mongoose from "mongoose";

const fleetVehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String },
    seats: { type: String },

    // optional documents per vehicle
    rcFile: { type: String },
    insuranceFile: { type: String },
  },
  { _id: false }
);

const fleetSchema = new mongoose.Schema(
  {
    // ===================================================
    // CATEGORY & ROLE
    // ===================================================
    category: {
      type: String,
      enum: ["fleet"],
      default: "fleet",
      required: true,
    },

    role: {
      type: String,
      default: "fleet",
    },

    // ===================================================
    // STEP 1: PERSONAL DETAILS
    // ===================================================
    profilePhoto: String,
    fullName: { type: String, required: true },
    lastName: String,
    email: String,

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    emergencyNumber: String,
    whatsappNumber: String,

    addressLine1: { type: String, required: true },
    addressLine2: String,
    state: { type: String, required: true },
    district: { type: String, required: true },
    pincode: { type: String, required: true },

    // ===================================================
    // STEP 2: FLEET OWNER DETAILS
    // ===================================================
    fleetOwnerType: {
      type: String,
      enum: ["individual", "company"],
      default: "individual",
    },

    fleetBusinessName: String,
    fleetGSTNumber: String,

    fleetNumberOfVehicles: {
      type: String,
      required: true,
    },

    // uploaded file (csv / pdf / excel)
    fleetDriversListFile: String,

    // ===================================================
    // STEP 2: FLEET VEHICLES (DYNAMIC LIST)
    // ===================================================
    fleetVehicles: [fleetVehicleSchema],

    // ===================================================
    // STEP 3: EMERGENCY CONTACTS
    // ===================================================
    emergencyContact1: { type: String, required: true },
    emergencyRelation1: { type: String, required: true },

    emergencyContact2: String,
    emergencyRelation2: String,

    // ===================================================
    // STEP 4: COMMON DOCUMENTS (OPTIONAL)
    // ===================================================
    aadharFront: String,
    aadharBack: String,
    dlFront: String,
    dlBack: String,
    policeClearance: String,

    // ===================================================
    // ADMIN / APPROVAL
    // ===================================================
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminNotes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Fleet", fleetSchema);
