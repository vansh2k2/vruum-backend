import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      required: true,
      enum: [
        "Car",
        "Bike",
        "Bus",
        "Auto",
        "Truck",
        "Scooter",
        "Mini",
        "Sedan",
        "SUV",
        "Hatchback"
      ],
    },

    image: {
      type: String, // base64 or URL
      required: true,
    },

    features: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", ServiceSchema);
