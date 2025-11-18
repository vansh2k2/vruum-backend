import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// =======================================
// CORS (FIXED FOR RENDER + NETLIFY)
// =======================================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =======================================
// BODY PARSER
// =======================================
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// =======================================
// IMPORT ALL ROUTES
// =======================================
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";

// =======================================
// ROOT ROUTE
// =======================================
app.get("/", (req, res) => {
  res.send("🚀 Vruum Backend Running Successfully (Render + Cloudinary Ready)");
});

// =======================================
// API ROUTES
// =======================================
app.use("/api/admin", adminRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/gallery", galleryRoutes);

// =======================================
// TEST MODEL ROUTE
// =======================================
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
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// =======================================
// MONGO + SERVER START
// =======================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () =>
      console.log(
        `🚀 Server started on PORT ${PORT} — Ready for Render Deploy ✔`
      )
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
  });
