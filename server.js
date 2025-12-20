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
// ✅ CORS CONFIG (FINAL FIX)
// =======================================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3103",
  "https://localhost:3103",
  "https://vruum-cab.onrender.com",
  "https://vruum-cab-admin.onrender.com",
  "https://vanshvruum19dec.netlify.app",
  "https://vruum-backend--vanshnamogange.replit.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ CORS blocked:", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// ✅ EXTRA PREFLIGHT HANDLER (Important for Replit/PATCH requests)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers for allowed origins
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).json({});
  }
  
  next();
});

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
const uri = process.env.MONGO_URI;

dns.setServers(['8.8.8.8', '1.1.1.1']);

async function connectWithRetry(retries = 6, baseDelay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ MongoDB connected');
      
      // Start server after successful DB connection
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
      return;
    } catch (err) {
      console.error(new Date().toISOString(), 'MongoDB connection failed:', err.message);
      console.error(err.stack);
      if (i === retries - 1) {
        console.error('Exceeded retries — keeping process alive to avoid tight nodemon restart loop');
        await new Promise(r => setTimeout(r, 60000));
        i = -1;
      } else {
        const wait = baseDelay * Math.pow(2, i);
        console.log(`Retrying in ${wait}ms (${i + 1}/${retries})`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }
}

connectWithRetry().catch(e => {
  console.error('Final connection failure', e);
});