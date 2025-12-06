import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    // CATEGORY (very important)
    category: {
      type: String,
      enum: ["partner", "driver", "ambulance", "hearse"],
      default: "partner",
      required: true,
    },

    // STEP 1: Personal Details
    profilePhoto: String,
    fullName: { type: String, required: true },
    email: String,
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    emergencyNumber: String,
    whatsappNumber: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    state: { type: String, required: true },
    district: { type: String, required: true },
    pincode: { type: String, required: true },

    // STEP 2: Vehicle Details (ONLY required for PARTNER / AMBULANCE / HEARSE)
    applyFor: { type: String }, // partner only
    vehicleType: { type: String }, // partner only
    vehicleNumber: { type: String },
    vehicleMake: { type: String },
    vehicleModel: { type: String },
    vehicleColor: { type: String },
    availableSeats: { type: String },
    vehiclePicture: String,

    // STEP 2 (DRIVER ONLY)
    driverExperienceYears: String,
    driverLicenseNumber: String,
    driverPreferredCity: String,
    driverShiftPreference: String,

    // STEP 2 (AMBULANCE ONLY)
    ambulanceServiceName: String,
    ambulanceOwnerName: String,
    ambulanceFeatures: String,

    // STEP 2 (HEARSE ONLY)
    hearseServiceName: String,
    hearseOwnerName: String,
    hearseFeatures: String,

    // STEP 3: Emergency Contacts
    emergencyContact1: { type: String, required: true },
    emergencyRelation1: { type: String, required: true },
    emergencyContact2: String,
    emergencyRelation2: String,

    // STEP 4: Documents (ALL OPTIONAL FIELDS NOW)
    aadharFront: String,
    aadharBack: String,
    dlFront: String,
    dlBack: String,
    policeClearance: String,
    rcCertificate: String,
    fitnessCertificate: String,
    pollutionCertificate: String,
    insuranceCertificate: String,

    // ADMIN SETTINGS
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: String,

    role: { type: String, default: "partner" },
  },
  { timestamps: true }
);

export default mongoose.model("Partner", partnerSchema);
