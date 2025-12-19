// =======================================================
// CORE IMPORTS
// =======================================================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// =======================================================
// ROUTE IMPORTS (ES MODULES)
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

// PARTNERS / VEHICLES
import partnerRoutes from "./routes/partnerRoutes.js";
import fleetRoutes from "./routes/fleetRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import ambulanceRoutes from "./routes/ambulanceRoutes.js";
import hearseRoutes from "./routes/hearseRoutes.js";

// UI / CMS
import offerRoutes from "./routes/offerRoutes.js";
import carouselRoutes from "./routes/carouselRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import offerStripRoutes from "./routes/offerStripRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";

// SERVICES
import serviceCategoryRoutes from "./routes/serviceCategoryRoutes.js";
import subServiceRoutes from "./routes/subServiceRoutes.js";

// CORPORATE
import corporateRoutes from "./routes/corporateRoutes.js";

// =======================================================
// APP INIT
// =======================================================
dotenv.config();
const app = express();

// =======================================================
// ✅ SAFE CORS CONFIG (FIXED)
// =======================================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3103",
  "https://localhost:3103",
  "https://vruum-cab.onrender.com",
  "https://vruum-cab-admin.onrender.com",
  "https://vanshvruum19dec.netlify.app",
];

// 🔥 MAIN CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server & tools
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);
      return callback(null, false); // ❗ error throw nahi karna
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// =======================================================
// BLOCK UNWANTED DOMAIN
// =======================================================
app.use((req, res, next) => {
  const referer = req.get("referer") || "";
  const host = req.get("host") || "";

  if (referer.includes("baokeek") || host.includes("baokeek")) {
    return res.status(403).json({
      success: false,
      message: "External domain blocked",
    });
  }
  next();
});

// =======================================================
// BODY PARSERS
// =======================================================
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// =======================================================
// STATIC FILES
// =======================================================
app.use("/uploads", express.static("uploads"));

// =======================================================
// HEALTH CHECK
// =======================================================
app.get("/", (req, res) => {
  res.send("🚀 Vruum Backend Running Successfully ✔");
});

// =======================================================
// API ROUTES
// =======================================================
app.use("/api/passengers", passengerAuthRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/fleet", fleetRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/hearse", hearseRoutes);
app.use("/api/corporate", corporateRoutes);

// ADMIN / CMS
app.use("/api/admin", adminRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/about", aboutRoutes);

// OFFERS / UI
app.use("/api/offers", offerRoutes);
app.use("/api/offer-strip", offerStripRoutes);
app.use("/api/carousel", carouselRoutes);

// SERVICES
app.use("/api/services", serviceRoutes);
app.use("/api/service-categories", serviceCategoryRoutes);
app.use("/api/sub-services", subServiceRoutes);

// =======================================================
// 404 HANDLER
// =======================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// =======================================================
// GLOBAL ERROR HANDLER
// =======================================================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =======================================================
// DATABASE + SERVER START
// =======================================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
