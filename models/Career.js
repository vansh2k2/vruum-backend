import mongoose from "mongoose";

const CareerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    position: { type: String, default: "" }, // subject / position applied
    message: { type: String, default: "" }, // cover letter
    resumeUrl: { type: String, default: "" }, // optional
    status: { type: String, enum: ["new","reviewed","rejected","hired"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("Career", CareerSchema);
