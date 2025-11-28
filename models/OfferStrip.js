import mongoose from "mongoose";

const OfferStripSchema = new mongoose.Schema(
  {
    textLeft: { type: String, required: true },         // e.g "Get"
    discountText: { type: String, required: true },     // e.g "₹100 OFF"
    textRight: { type: String, required: true },        // e.g "on Your First Ride — Use Code:"
    couponCode: { type: String, required: true },       // e.g "VRUUM100"
    buttonText: { type: String, default: "Book Now" },

    // UI Colors (Admin change karega)
    bgGradientFrom: { type: String, default: "#7C3AED" },
    bgGradientVia: { type: String, default: "#3B82F6" },
    bgGradientTo: { type: String, default: "#7C3AED" },
    discountBg: { type: String, default: "#ffffff" },
    discountTextColor: { type: String, default: "#7C3AED" },
    couponBg: { type: String, default: "rgba(255,255,255,0.2)" },
    couponTextColor: { type: String, default: "#ffffff" },
  },
  { timestamps: true }
);

export default mongoose.model("OfferStrip", OfferStripSchema);
