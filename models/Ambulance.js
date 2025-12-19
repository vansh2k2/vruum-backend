import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema(
  {
    // CATEGORY
    category: {
      type: String,
      default: "ambulance",
      required: true,
    },

    // PERSONAL DETAILS
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

    // AMBULANCE DETAILS
    ambulanceServiceName: { type: String, required: true },
    ambulanceOwnerName: { type: String, required: true },
    ambulanceFeatures: String,

    vehicleNumber: { type: String, required: true },
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    vehicleColor: { type: String, required: true },
    availableSeats: { type: String },
    vehiclePicture: String,

    // DOCUMENTS
    aadharFront: String,
    aadharBack: String,
    dlFront: String,
    dlBack: String,
    policeClearance: String,
    rcCertificate: String,
    fitnessCertificate: String,
    pollutionCertificate: String,
    insuranceCertificate: String,

    // ADMIN
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: String,

    role: { type: String, default: "ambulance" },
  },
  { timestamps: true }
);

export default mongoose.model("Ambulance", ambulanceSchema);
