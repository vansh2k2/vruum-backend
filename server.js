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
// CORS FIX (FOR LOCAL + RENDER)
// =======================================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://vruum-cab.onrender.com",        // your main website (if deployed)
      "https://vruum-cab-admin.onrender.com",  // your admin panel (if deployed)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Extra headers for Render (IMPORTANT)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// =======================================================
// BODY PARSERS
// =======================================================
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// =======================================================
// STATIC UPLOAD FOLDER
// =======================================================
app.use("/uploads", express.static("uploads"));

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

import passengerAuthRoutes from "./routes/passengerAuthRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";

import offerRoutes from "./routes/offerRoutes.js";
import carouselRoutes from "./routes/carouselRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

import offerStripRoutes from "./routes/offerStripRoutes.js";

// ⭐ NEW — ABOUT ROUTE
import aboutRoutes from "./routes/aboutRoutes.js";

// =======================================================
// TEST ROOT
// =======================================================
app.get("/", (req, res) => {
  res.send("🚀 Vruum Backend Running Successfully! All APIs are online ✔");
});

// =======================================================
// CONNECT ALL ROUTES
// =======================================================
app.use("/api/passengers", passengerAuthRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/services", serviceRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/support", supportRoutes);

app.use("/api/offer-strip", offerStripRoutes);

// ⭐ NEW ABOUT API
app.use("/api/about", aboutRoutes);

// =======================================================
// SIMPLE TEST ROUTE
// =======================================================
const TestSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const TestModel = mongoose.model("Test", TestSchema);

app.post("/api/test", async (req, res) => {
  try {
    const doc = await TestModel.create(req.body);

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
      console.log(`🚀 Server running on PORT ${PORT} — Ready for Render ✔`)
    );
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
  });
