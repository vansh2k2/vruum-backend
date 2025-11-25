// =======================================================
// IMPORTS
// =======================================================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// =======================================================
// CORS
// =======================================================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =======================================================
// BODY PARSERS
// =======================================================
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// =======================================================
// IMPORT ROUTES
// =======================================================
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

// Passenger Routes
import passengerAuthRoutes from "./routes/passengerAuthRoutes.js";

// Partner Routes
import partnerRoutes from "./routes/partnerRoutes.js";

// ⭐⭐ NEW: Offer Routes
import offerRoutes from "./routes/offerRoutes.js";

// ⭐⭐ NEW: Carousel Routes
import carouselRoutes from "./routes/carouselRoutes.js";   // <-- ADD HERE


// =======================================================
// ROOT TEST ROUTE
// =======================================================
app.get("/", (req, res) => {
  res.send("🚀 Vruum Backend Running Successfully. Passenger + Partner + Support + Admin API Online ✔");
});

// =======================================================
// CONNECT ALL ROUTES
// =======================================================

// Passenger Public Routes
app.use("/api/passengers", passengerAuthRoutes);

// Partner Routes
app.use("/api/partners", partnerRoutes);

// Offer Routes ⭐
app.use("/api/offers", offerRoutes);

// ⭐⭐ NEW — CAROUSEL ROUTES
app.use("/api/carousel", carouselRoutes);  // <-- ADD HERE

// Existing Routes
app.use("/api/admin", adminRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/support", supportRoutes);

// =======================================================
// TEST ROUTE
// =======================================================
const TestSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const TestModel = mongoose.model("Test", TestSchema);

app.post("/api/test", async (req, res) => {
  try {
    const doc = await TestModel.create({
      name: req.body.name,
      email: req.body.email,
    });

    res.json({
      success: true,
      message: "Test data saved successfully!",
      data: doc,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// =======================================================
// MONGO + SERVER
// =======================================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on PORT ${PORT} — Ready for Render Deploy ✔`)
    );
  })
  .catch((err) => {
    console.log("❌ MongoDB error:", err.message);
  });
