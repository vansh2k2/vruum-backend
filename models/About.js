const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    // Main heading text
    heading: {
      type: String,
      default: "We Provide Trusted Cab Service",
    },

    // Experience badge
    experienceYears: {
      type: String, // "5+"
      default: "5+",
    },
    experienceLabel: {
      type: String, // "Years of Trusted Service"
      default: "Years of Trusted Service",
    },

    // Images
    mainImage: {
      type: String, // URL
      required: true,
    },
    secondaryImage: {
      type: String, // URL
      required: true,
    },

    // Mission
    missionTitle: {
      type: String,
      default: "Our Mission",
    },
    missionText: {
      type: String,
      required: true,
    },

    // Vision
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

module.exports = mongoose.model("About", aboutSchema);
