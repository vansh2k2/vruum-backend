import mongoose from "mongoose";

const sarthiSchema = new mongoose.Schema(
  {
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
    
    // Driver Details
    experienceYears: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    preferredCity: { type: String, required: true },
    shiftPreference: {
      type: String,
      enum: ["day", "night", "both"],
      default: "day",
    },
    
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
    
    // Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "assigned", "available"],
      default: "pending",
    },
    assignedVehicle: {
      vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "FleetVehicle" },
      vehicleNumber: String,
      partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
    },
    adminNotes: String,
    role: { type: String, default: "sarthi" },
    category: { type: String, default: "driver" },
  },
  { timestamps: true }
);

export default mongoose.model("Sarthi", sarthiSchema);