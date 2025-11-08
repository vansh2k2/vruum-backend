import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

// ✅ Create Blog
router.post("/", async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json({ success: true, message: "Blog created", blog: newBlog });
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    res.status(500).json({ success: false, message: "Failed to create blog", error: error.message });
  }
});

// ✅ Get All Blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get Single Blog (by slug)
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const relatedBlogs = await Blog.find({ _id: { $ne: blog._id } })
      .limit(3)
      .select("title slug excerpt category");

    res.json({ blog, relatedBlogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update Blog
router.put("/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Blog updated", updatedBlog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Delete Blog
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
