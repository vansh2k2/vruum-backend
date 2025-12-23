import mongoose from "mongoose";

const fleetSchema = new mongoose.Schema(
  {
    // Fleet Owner Details
    fleetOwnerType: {
      type: String,
      enum: ["individual", "company"],
      default: "individual",
    },
    businessName: String,
    gstNumber: String,
    
    // Personal Details (same as partner)
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
    
    // Fleet Details
    numberOfVehicles: { type: Number, required: true },
    driversListFile: String, // Cloudinary URL
    
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
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: String,
    role: { type: String, default: "fleet" },
    category: { type: String, default: "fleet" },
  },
  { timestamps: true }
);

// Fleet Vehicles (separate collection)
const fleetVehicleSchema = new mongoose.Schema({
  fleetId: { type: mongoose.Schema.Types.ObjectId, ref: "Fleet", required: true },
  vehicleNumber: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  color: String,
  seats: Number,
  rcFile: String,
  insuranceFile: String,
  status: { type: String, default: "active" },
});

export const FleetVehicle = mongoose.model("FleetVehicle", fleetVehicleSchema);
export default mongoose.model("Fleet", fleetSchema);