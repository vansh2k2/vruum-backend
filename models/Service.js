// backend/models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Features = list (AC Comfort, GPS Tracking, ...)
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    // "Most Popular" / "Best Value" / "Fastest" etc
    badge: {
      type: String,
      default: "",
      trim: true,
    },

    // image URL (Cloudinary/local upload se jo URL mile)
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // Tailwind gradient for icon / badge / button
    gradient: {
      type: String, // e.g. "from-blue-600 to-indigo-600"
      default: "from-blue-600 to-indigo-600",
    },

    // Tailwind bg gradient behind full card
    bgGradient: {
      type: String, // e.g. "from-blue-50 to-indigo-50"
      default: "from-blue-50 to-indigo-50",
    },

    // Optional: card order (1,2,3...)
    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
