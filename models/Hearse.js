import mongoose from "mongoose";

const hearseSchema = new mongoose.Schema(
  {
    // CATEGORY
    category: {
      type: String,
      default: "hearse",
      enum: ["hearse"],
      required: true,
    },

    // ======================
    // STEP 1: PERSONAL DETAILS
    // ======================
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

    // ======================
    // STEP 2: HEARSE DETAILS
    // ======================
    hearseServiceName: { type: String, required: true },
    hearseOwnerName: { type: String, required: true },
    hearseFeatures: String,

    vehicleNumber: { type: String, required: true },
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    vehicleColor: { type: String, required: true },
    availableSeats: { type: String, required: true },
    vehiclePicture: String,

    // ======================
    // STEP 3: EMERGENCY CONTACTS
    // ======================
    emergencyContact1: { type: String, required: true },
    emergencyRelation1: { type: String, required: true },
    emergencyContact2: String,
    emergencyRelation2: String,

    // ======================
    // STEP 4: DOCUMENTS
    // ======================
    aadharFront: String,
    aadharBack: String,
    dlFront: String,
    dlBack: String,
    policeClearance: String,
    rcCertificate: String,
    fitnessCertificate: String,
    pollutionCertificate: String,
    insuranceCertificate: String,

    // ======================
    // ADMIN CONTROL
    // ======================
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: String,

    role: {
      type: String,
      default: "hearse",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hearse", hearseSchema);
