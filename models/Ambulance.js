// models/Ambulance.js
import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema(
  {
    // Service Details
    serviceName: { type: String, required: true },
    ownerName: { type: String, required: true },
    
    // Personal Details - IMPORTANT: Yeh ab ownerName ke alag hai
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
    features: String, // Special equipment
    
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
    
    // Status Fields (Admin Approval)
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
      enum: ["available", "on-duty", "off-duty"],
      default: "off-duty",
    },
    adminNotes: String,
    
    // Category & Role
    role: { 
      type: String, 
      default: "ambulance",
      enum: ["ambulance"] 
    },
    category: { 
      type: String, 
      default: "ambulance",
      enum: ["ambulance"] 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ambulance", ambulanceSchema);