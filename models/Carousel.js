import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema(
  {
    // 3 images (base64 ya URL)
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (val) => Array.isArray(val) && val.length === 3,
        message: "Exactly 3 images are required",
      },
    },

    // ❗ OLD TITLE (will act as first phrase for backward compatibility)
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ❗ NEW FIELD — MULTIPLE PHRASES (TYPEWRITER)
    phrases: {
      type: [String],
      validate: {
        validator: function (value) {
          // Allowed empty ONLY for backward compatibility
          if (!value || value.length === 0) return true;

          return value.length >= 3 && value.length <= 5;
        },
        message: "Phrases must be between 3 to 5 items",
      },
      default: [],
    },

    // Hero description / subtitle
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional CTA text
    buttonText: {
      type: String,
      default: "Book Your Ride Now",
      trim: true,
    },

    // Overlay opacity (0 – 1)
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

// 🔥 AUTO-MIGRATION LOGIC — Convert old "title" to first phrase
carouselSchema.pre("save", function (next) {
  if (this.phrases.length === 0 && this.title) {
    this.phrases = [this.title];
  }

  // Ensure max 5 always
  if (this.phrases.length > 5) {
    this.phrases = this.phrases.slice(0, 5);
  }

  next();
});

const Carousel = mongoose.model("Carousel", carouselSchema);

export default Carousel;
