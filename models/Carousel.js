import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema(
  {
    // ✅ 3–10 images allowed
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (val) =>
          Array.isArray(val) && val.length >= 3 && val.length <= 10,
        message: "Carousel must have between 3 and 10 images",
      },
    },

    // ❌ NOT required from frontend anymore
    title: {
      type: String,
      trim: true,
    },

    // ✅ REQUIRED phrases (admin panel already sends this)
    phrases: {
      type: [String],
      required: true,
      validate: {
        validator: (val) => val.length >= 3 && val.length <= 5,
        message: "Phrases must be between 3 to 5 items",
      },
    },

    subtitle: {
      type: String,
      required: true,
      trim: true,
    },

    buttonText: {
      type: String,
      default: "Book Your Ride Now",
    },

    overlayOpacity: {
      type: Number,
      default: 0.8,
      min: 0,
      max: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔥 AUTO SYNC — title = first phrase
carouselSchema.pre("validate", function (next) {
  if (!this.title && this.phrases?.length > 0) {
    this.title = this.phrases[0];
  }
  next();
});

export default mongoose.model("Carousel", carouselSchema);
