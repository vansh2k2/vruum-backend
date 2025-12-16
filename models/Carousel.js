import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema(
  {
    // ✅ 3–10 images allowed (base64 or URL)
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length >= 3 && val.length <= 10;
        },
        message: "Carousel must have between 3 and 10 images",
      },
    },

    // OLD TITLE (backward compatibility)
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // MULTIPLE PHRASES (TYPEWRITER)
    phrases: {
      type: [String],
      validate: {
        validator: function (value) {
          // Allow empty for backward compatibility
          if (!value || value.length === 0) return true;
          return value.length >= 3 && value.length <= 5;
        },
        message: "Phrases must be between 3 to 5 items",
      },
      default: [],
    },

    // Hero description
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },

    // CTA text
    buttonText: {
      type: String,
      default: "Book Your Ride Now",
      trim: true,
    },

    // Overlay opacity
    overlayOpacity: {
      type: Number,
      default: 0.8,
      min: 0,
      max: 1,
    },

    // Active / Inactive
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔥 AUTO-MIGRATION — title → first phrase
carouselSchema.pre("save", function (next) {
  if (this.phrases.length === 0 && this.title) {
    this.phrases = [this.title];
  }

  // Ensure max 5 phrases
  if (this.phrases.length > 5) {
    this.phrases = this.phrases.slice(0, 5);
  }

  next();
});

const Carousel = mongoose.model("Carousel", carouselSchema);
export default Carousel;
