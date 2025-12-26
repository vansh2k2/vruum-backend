import mongoose from "mongoose";

const hearseSchema = new mongoose.Schema(
  {
    serviceName: { type: String, required: true },
    ownerName: { type: String, required: true },

    profilePhoto: String,
    fullName: { type: String, required: true },
    email: String,

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔥 IMPORTANT
    },

    emergencyNumber: String,
    whatsappNumber: String,

    addressLine1: { type: String, required: true },
    addressLine2: String,
    state: { type: String, required: true },
    district: { type: String, required: true },
    pincode: { type: String, required: true },

    vehicleNumber: { type: String, required: true },
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    vehicleColor: String,
    availableSeats: Number,
    vehiclePicture: String,
    features: String,

    emergencyContact1: { type: String, required: true },
    emergencyRelation1: { type: String, required: true },
    emergencyContact2: String,
    emergencyRelation2: String,

    aadharFront: String,
    aadharBack: String,
    dlFront: String,
    dlBack: String,
    policeClearance: String,
    rcCertificate: String,
    fitnessCertificate: String,
    pollutionCertificate: String,
    insuranceCertificate: String,

    // 🔥 APPROVAL SYSTEM
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "on-duty", "unavailable"],
      default: "available",
    },

    role: { type: String, default: "hearse" },
    category: { type: String, default: "hearse" },
  },
  { timestamps: true }
);

export default mongoose.model("Hearse", hearseSchema);
