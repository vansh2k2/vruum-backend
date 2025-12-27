import mongoose from "mongoose";

/* =====================================================
   FLEET OWNER SCHEMA
===================================================== */
const fleetSchema = new mongoose.Schema(
  {
    // ✅ Fleet Owner Details
    fleetOwnerType: {
      type: String,
      enum: ["individual", "company"],
      default: "individual",
    },
    businessName: String,
    gstNumber: String,
    
    // ✅ Personal Details (same as partner)
    profilePhoto: String,
    fullName: { type: String, required: true },
    lastName: String,
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
    
    // ✅ Fleet Details
    numberOfVehicles: { type: Number, required: true },
    driversListFile: String, // CSV/Excel/PDF Cloudinary URL
    
    // ✅ Emergency Contacts
    emergencyContact1: { type: String, required: true },
    emergencyRelation1: { type: String, required: true },
    emergencyContact2: String,
    emergencyRelation2: String,
    
    // ✅ Documents (Owner's Personal Documents)
    aadharFront: String,
    aadharBack: String,
    dlFront: String,
    dlBack: String,
    policeClearance: String,
    
    // ✅ Status & Approval
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    adminNotes: String,
    
    // ✅ Role & Category
    role: { type: String, default: "fleet" },
    category: { type: String, default: "fleet" },
  },
  { timestamps: true }
);

/* =====================================================
   FLEET VEHICLES SCHEMA (SEPARATE COLLECTION)
===================================================== */
const fleetVehicleSchema = new mongoose.Schema(
  {
    fleetId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Fleet", 
      required: true 
    },
    
    // ✅ Vehicle Details
    vehicleNumber: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    color: String,
    seats: Number,
    
    // ✅ Vehicle Documents (RC & Insurance)
    rcFile: String,         // Cloudinary URL
    insuranceFile: String,  // Cloudinary URL
    
    // ✅ Status
    status: { 
      type: String, 
      enum: ["active", "inactive", "maintenance"],
      default: "active" 
    },
  },
  { timestamps: true }
);

// ✅ Export both models
export const Fleet = mongoose.model("Fleet", fleetSchema);
export const FleetVehicle = mongoose.model("FleetVehicle", fleetVehicleSchema);

export default Fleet;