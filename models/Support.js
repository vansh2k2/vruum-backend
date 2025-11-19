import mongoose from "mongoose";

const SupportSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    vehicleType: String,
    bookingId: String,
    issueType: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Support", SupportSchema);
