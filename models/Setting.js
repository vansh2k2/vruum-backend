// models/Setting.js
import mongoose from "mongoose";

const SocialSchema = new mongoose.Schema({
  facebook: { type: String, default: "" },
  twitter:  { type: String, default: "" },
  instagram:{ type: String, default: "" },
  linkedin: { type: String, default: "" },
}, { _id: false });

const SettingSchema = new mongoose.Schema({
  siteName:     { type: String, default: "Vruum Cab" },
  contactEmail: { type: String, default: "info@vruum.com" },
  contactPhone: { type: String, default: "+1 123 654 7898" },
  logo:         { type: String, default: "" },        // URL ya base64
  socialLinks:  { type: SocialSchema, default: () => ({}) },
}, { timestamps: true });

export default mongoose.model("Setting", SettingSchema);
