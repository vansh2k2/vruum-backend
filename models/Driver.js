import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    // CATEGORY
    category: {
      type: String,
      default: "driver",
      enum: ["driver"],
      required: true,
    },

    // STEP 1: Personal Details
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

    // STEP 2: DRIVER DETAILS (IMPORTANT)
    driverExperienceYears: { type: String, required: true },
    driverLicenseNumber: { type: String, required: true },
    driverPreferredCity: { type: String, required: true },
    driverShiftPreference: { type: String, required: true },

    // STEP 3: Emergency Contacts
    emergencyContact1: { type: String, required: true },
    emergencyRelation1: { type: String, required: true },
    emergencyContact2: String,
    emergencyRelation2: String,

    // STEP 4: Documents
    aadharFront: String,
    aadharBack: String,
    dlFront: String,
    dlBack: String,
    policeClearance: String,

    // ADMIN
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: String,

    role: { type: String, default: "driver" },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
