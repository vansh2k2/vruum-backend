import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Import All Routes
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import blogRoutes from "./routes/blogRoutes.js"; // ✅ Blog route added
import faqRoutes from "./routes/faqRoutes.js";

dotenv.config();
const app = express();

// ✅ CORS Setup (Allow both website & admin panel)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Body Parser — increased limits for images/base64
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🚀 Vruum Backend Server Running Successfully ✅");
});

// ✅ API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes); // ✅ Blog route connected
app.use("/api/faqs", faqRoutes);

// ✅ (Optional) Quick Test Route for MongoDB connection
const TestSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const TestModel = mongoose.model("Test", TestSchema);

app.post("/api/test", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newDoc = new TestModel({ name, email });
    await newDoc.save();
    res.json({
      success: true,
      message: "✅ Data saved to MongoDB!",
      data: newDoc,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));
