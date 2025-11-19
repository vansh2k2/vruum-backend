import Passenger from "../models/Passenger.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const TOKEN_EXPIRES = "7d";

// ===========================
// ⭐ REGISTER
// ===========================
export const registerPassenger = async (req, res) => {
  try {
    const { fullName, email, phone, city, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const existing = await Passenger.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "Email already registered.",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const passenger = await Passenger.create({
      fullName,
      email,
      phone,
      city,
      password: hash,
    });

    const token = jwt.sign(
      { id: passenger._id, role: "passenger" },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES }
    );

    res.status(201).json({
      success: true,
      message: "Passenger registered successfully.",
      passenger,
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===========================
// ⭐ LOGIN
// ===========================
export const loginPassenger = async (req, res) => {
  try {
    const { email, password } = req.body;

    const passenger = await Passenger.findOne({ email });
    if (!passenger) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, passenger.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: passenger._id, role: "passenger" },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES }
    );

    res.json({
      success: true,
      message: "Login successful.",
      passenger,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===========================
// ⭐ GET ALL PASSENGERS
// ===========================
export const getAllPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      passengers,
    });
  } catch (error) {
    console.error("Fetch Passengers Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===========================
// ⭐ DELETE PASSENGER
// ===========================
export const deletePassenger = async (req, res) => {
  try {
    const { id } = req.params;

    const passenger = await Passenger.findByIdAndDelete(id);

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found",
      });
    }

    res.json({
      success: true,
      message: "Passenger deleted successfully",
    });
  } catch (error) {
    console.error("Delete Passenger Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
