import mongoose from "mongoose";

const corporateSchema = new mongoose.Schema(
  {
    // Company Information
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    companyEmail: {
      type: String,
      required: [true, "Company email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    companyPhone: {
      type: String,
      required: [true, "Company phone is required"],
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    panNumber: {
      type: String,
      trim: true,
    },
    companyAddress: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
    },

    // Contact Person
    contactPersonName: {
      type: String,
      required: [true, "Contact person name is required"],
      trim: true,
    },
    contactPersonEmail: {
      type: String,
      required: [true, "Contact email is required"],
      lowercase: true,
      trim: true,
    },
    contactPersonPhone: {
      type: String,
      required: [true, "Contact phone is required"],
      trim: true,
    },

    // Account
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // Vehicle Requirements
    vehicleRequirements: {
      vehicleType: String,
      seatingCapacity: String,
      numberOfCabs: Number,
      employeesCount: Number,
      shiftTimings: String,
      monthlyTravelEstimate: Number,
      pickupLocations: String,
      additionalNotes: String,
    },

    // Admin Control
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active"],
      default: "pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationNotes: String,
    verificationDate: Date,

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
corporateSchema.index({ companyEmail: 1 });
corporateSchema.index({ status: 1 });
corporateSchema.index({ registeredAt: -1 });

const Corporate = mongoose.model("Corporate", corporateSchema);

export default Corporate;
