  import mongoose from "mongoose";

  const partnerSchema = new mongoose.Schema(
    {
      // STEP 1: Personal Details
      profilePhoto: { type: String }, // Cloudinary URL
      fullName: { type: String, required: true },
      email: { type: String },

      // ⭐ Important for Login
      phoneNumber: { type: String, required: true, unique: true },

      // ⭐ Password Added for Login
      password: { type: String, required: true },

      emergencyNumber: { type: String },
      whatsappNumber: { type: String },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      state: { type: String, required: true },
      district: { type: String, required: true },
      pincode: { type: String, required: true },

      // STEP 2: Vehicle Details
      applyFor: { type: String, required: true }, // own-vehicle / sarathi
      vehicleType: { type: String, required: true }, // motor-bike, auto, taxi
      vehicleNumber: { type: String, required: true },
      vehicleMake: { type: String, required: true },
      vehicleModel: { type: String, required: true },
      vehicleColor: { type: String, required: true },
      availableSeats: { type: String, required: true },
      vehiclePicture: { type: String }, // Cloudinary URL

      // STEP 3: Emergency Contacts
      emergencyContact1: { type: String, required: true },
      emergencyRelation1: { type: String, required: true },
      emergencyContact2: { type: String },
      emergencyRelation2: { type: String },

      // STEP 4: Documents (All Cloudinary URLs)
      aadharFront: { type: String, required: true },
      aadharBack: { type: String, required: true },
      dlFront: { type: String, required: true },
      dlBack: { type: String, required: true },
      policeClearance: { type: String }, // optional
      rcCertificate: { type: String, required: true },
      fitnessCertificate: { type: String, required: true },
      pollutionCertificate: { type: String },
      insuranceCertificate: { type: String, required: true },

      // Admin controlled (for dashboard)
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },

      adminNotes: { type: String },

      // ⭐ helpful future feature
      role: {
        type: String,
        default: "partner",
      },
    },
    { timestamps: true }
  );

  export default mongoose.model("Partner", partnerSchema);
