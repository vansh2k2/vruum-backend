import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },
    color: { type: String, required: true },
    icon: { type: String, default: "Gift" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Offer", OfferSchema);
