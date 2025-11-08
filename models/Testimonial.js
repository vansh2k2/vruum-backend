import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
    image: { type: String, default: "/logo.png" }, // optional avatar
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
