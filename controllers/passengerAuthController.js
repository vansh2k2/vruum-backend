import Passenger from "../models/Passenger.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// JWT Expires in (can change)
const TOKEN_EXPIRES = "7d";

export const registerPassenger = async (req, res) => {
  try {
    const { fullName, email, phone, city, password } = req.body;

    // Basic validation
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // Email exists check
    const existing = await Passenger.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "Email already registered.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new passenger
    const passenger = new Passenger({
      fullName,
      email,
      phone,
      city,
      password: hashedPassword,
    });

    await passenger.save();

    // Create JWT
    const token = jwt.sign(
      { id: passenger._id, role: "passenger" },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES }
    );

    res.status(201).json({
      message: "Passenger registered successfully.",
      passenger: {
        id: passenger._id,
        fullName: passenger.fullName,
        email: passenger.email,
        phone: passenger.phone,
        city: passenger.city,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginPassenger = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password." });
    }

    // Find user
    const passenger = await Passenger.findOne({ email });
    if (!passenger) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, passenger.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: passenger._id, role: "passenger" },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES }
    );

    res.json({
      message: "Login successful.",
      passenger: {
        id: passenger._id,
        fullName: passenger.fullName,
        email: passenger.email,
        phone: passenger.phone,
        city: passenger.city,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
