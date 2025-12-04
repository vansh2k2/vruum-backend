import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "We Provide Trusted Cab Service",
    },

    experienceYears: {
      type: String,
      default: "5+",
    },
    experienceLabel: {
      type: String,
      default: "Years of Trusted Service",
    },

    mainImage: {
      type: String,
      required: true,
    },
    secondaryImage: {
      type: String,
      required: true,
    },

    missionTitle: {
      type: String,
      default: "Our Mission",
    },
    missionText: {
      type: String,
      required: true,
    },

    visionTitle: {
      type: String,
      default: "Our Vision",
    },

    visionPoints: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("About", AboutSchema);
