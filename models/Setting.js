// models/Setting.js
import mongoose from "mongoose";

const SocialSchema = new mongoose.Schema(
  {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
  },
  { _id: false }
);

const CounterSchema = new mongoose.Schema(
  {
    happyCustomers: { type: Number, default: 1200 },
    totalRides: { type: Number, default: 5000 },
    citiesCovered: { type: Number, default: 50 },
    professionalDrivers: { type: Number, default: 300 },
  },
  { _id: false }
);

const SettingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Vruum Cab" },
    contactEmail: { type: String, default: "info@vruum.com" },
    contactPhone: { type: String, default: "+1 123 654 7898" },
    logo: { type: String, default: "" },

    socialLinks: { type: SocialSchema, default: () => ({}) },

    counters: {
      type: CounterSchema,
      default: () => ({
        happyCustomers: 1200,
        totalRides: 5000,
        citiesCovered: 50,
        professionalDrivers: 300,
      }),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", SettingSchema);
