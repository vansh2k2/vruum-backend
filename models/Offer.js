import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },

    // ⭐ BACKGROUND — fully dynamic
    // Can be:
    // - Tailwind class (bg-red-100)
    // - Gradient class (from-red-100 via-red-200 ...)
    // - Hex (#ff0000)
    // - RGB (rgb(255,0,0))
    // - Linear gradient (linear-gradient(...))
    background: { type: String, default: "bg-white" },

    // ⭐ TEXT COLOR — dynamic
    textColor: { type: String, default: "#0A2342" },

    // ⭐ ICON COLOR — dynamic
    iconColor: { type: String, default: "#0A2342" },

    // ⭐ COUPON CODE — to copy on click
    couponCode: { type: String, default: "" },

    // ⭐ ICON NAME — backend se set
    icon: { type: String, default: "Gift" },

    // ⭐ ORDER
    order: { type: Number, default: 0 },

    // ⭐ ACTIVE / INACTIVE
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Offer", OfferSchema);
