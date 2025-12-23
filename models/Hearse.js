import mongoose from "mongoose";

const hearseSchema = new mongoose.Schema(
  {
    // Service Details
    serviceName: { type: String, required: true },
    ownerName: { type: String, required: true },
    
    // Personal Details
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
    
    // Vehicle Details
    vehicleNumber: { type: String, required: true },
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    vehicleColor: String,
    availableSeats: Number,
    vehiclePicture: String,
    features: String, // Freezer box, decor etc.
    
    // Emergency Contacts
    emergencyContact1: { type: String, required: true },
    emergencyRelation1: { type: String, required: true },
    emergencyContact2: String,
    emergencyRelation2: String,
    
    // Documents
    aadharFront: String,
    aadharBack: String,
    dlFront: String,
    dlBack: String,
    policeClearance: String,
    rcCertificate: String,
    fitnessCertificate: String,
    pollutionCertificate: String,
    insuranceCertificate: String,
    
    // Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "on-duty", "available"],
      default: "pending",
    },
    adminNotes: String,
    role: { type: String, default: "hearse" },
    category: { type: String, default: "hearse" },
  },
  { timestamps: true }
);

export default mongoose.model("Hearse", hearseSchema);