import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

// Route imports
import adminRoutes from "./routes/adminRoutes.js";
import passengerAuthRoutes from "./routes/passengerAuthRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import fleetRoutes from "./routes/fleetRoutes.js";
import sarthiRoutes from "./routes/sarthiRoutes.js";
import ambulanceRoutes from "./routes/ambulanceRoutes.js";
import hearseRoutes from "./routes/hearseRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import carouselRoutes from "./routes/carouselRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import offerStripRoutes from "./routes/offerStripRoutes.js";
import serviceCategoryRoutes from "./routes/serviceCategoryRoutes.js";
import subServiceRoutes from "./routes/subServiceRoutes.js";
import corporateRoutes from "./routes/corporateRoutes.js";

dotenv.config();
const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3103",
  "https://localhost:3103",
    "http://localhost:5175",
  "https://vruum-cab.onrender.com",
  "https://vruum-cab-admin.onrender.com",
  "https://vanshvruum19dec.netlify.app",
  "https://vruum-backend--vanshnamogange.replit.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log("CORS blocked:", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Handle preflight requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).json({});
  }
  next();
});

// Block unwanted domains
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

// Body parsers
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Static files
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/", (req, res) => {
  res.send("Vruum Backend Running Successfully");
});

// API routes - Authentication & Admin
app.use("/api/admin", adminRoutes);
app.use("/api/passengers", passengerAuthRoutes);

// API routes - Partners & Vehicle Management
app.use("/api/partners", partnerRoutes);
app.use("/api/fleet", fleetRoutes);
app.use("/api/sarthi", sarthiRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/hearse", hearseRoutes);

// API routes - Corporate
app.use("/api/corporate", corporateRoutes);

// API routes - Content Management
app.use("/api/contacts", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/about", aboutRoutes);

// API routes - Settings & Configuration
app.use("/api/settings", settingRoutes);

// API routes - UI Components & Offers
app.use("/api/offers", offerRoutes);
app.use("/api/offer-strip", offerStripRoutes);
app.use("/api/carousel", carouselRoutes);

// API routes - Services
app.use("/api/services", serviceRoutes);
app.use("/api/service-categories", serviceCategoryRoutes);
app.use("/api/sub-services", subServiceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Database connection with retry logic
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function connectWithRetry(retries = 6, baseDelay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("MongoDB connected successfully");

      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
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
          "Exceeded retries - keeping process alive to avoid tight restart loop"
        );
        await new Promise((r) => setTimeout(r, 60000));
        i = -1;
      } else {
        const wait = baseDelay * Math.pow(2, i);
        console.log(`Retrying in ${wait}ms (${i + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, wait));
      }
    }
  }
}

connectWithRetry().catch((e) => {
  console.error("Final connection failure:", e);
});