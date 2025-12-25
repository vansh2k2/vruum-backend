// =======================================================
// CORE IMPORTS
// =======================================================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

// =======================================================
// ROUTE IMPORTS (ES MODULES)
// =======================================================
// ADMIN & AUTH
import adminRoutes from "./routes/adminRoutes.js";
import passengerAuthRoutes from "./routes/passengerAuthRoutes.js";

// PARTNERS & VEHICLES
import partnerRoutes from "./routes/partnerRoutes.js";
import fleetRoutes from "./routes/fleetRoutes.js";
import sarthiRoutes from "./routes/sarthiRoutes.js"; // ✅ Sarthi (not driver)
import ambulanceRoutes from "./routes/ambulanceRoutes.js";
import hearseRoutes from "./routes/hearseRoutes.js";

// CMS & CONTENT
import contactRoutes from "./routes/contactRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";

// SETTINGS & CONFIGURATION
import settingRoutes from "./routes/settingRoutes.js";

// UI COMPONENTS
import offerRoutes from "./routes/offerRoutes.js";
import carouselRoutes from "./routes/carouselRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import offerStripRoutes from "./routes/offerStripRoutes.js";

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

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3103",
      "https://vanshvruummcabb.netlify.app",
      "https://vruum-backend.onrender.com",
    ],
    credentials: true,
  })
);

// =======================================================
// SECURITY - BLOCK UNWANTED DOMAINS
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

// AUTHENTICATION & ADMIN
app.use("/api/admin", adminRoutes);
app.use("/api/passengers", passengerAuthRoutes);

// PARTNERS & VEHICLES MANAGEMENT
app.use("/api/partners", partnerRoutes);
app.use("/api/fleet", fleetRoutes);
app.use("/api/sarthi", sarthiRoutes); // ✅ Sarthi routes (drivers)
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/hearse", hearseRoutes);

// CORPORATE
app.use("/api/corporate", corporateRoutes);

// CMS & CONTENT MANAGEMENT
app.use("/api/contacts", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/about", aboutRoutes);

// SETTINGS
app.use("/api/settings", settingRoutes);

// UI COMPONENTS & OFFERS
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
const uri = process.env.MONGO_URI;

// DNS configuration for better connection stability
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function connectWithRetry(retries = 6, baseDelay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ MongoDB connected successfully");

      // Start server after successful DB connection
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      });
      return;
    } catch (err) {
      console.error(
        new Date().toISOString(),
        "MongoDB connection failed:",
        err.message
      );

      if (i === retries - 1) {
        console.error(
          "⚠️ Exceeded retries — keeping process alive to avoid tight nodemon restart loop"
        );
        await new Promise((r) => setTimeout(r, 60000));
        i = -1; // Restart retry loop
      } else {
        const wait = baseDelay * Math.pow(2, i);
        console.log(`⏳ Retrying in ${wait}ms (${i + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, wait));
      }
    }
  }
}

connectWithRetry().catch((e) => {
  console.error("❌ Final connection failure:", e);
});