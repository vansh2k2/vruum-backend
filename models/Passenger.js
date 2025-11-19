import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  city: { type: String, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Passenger ||
  mongoose.model("Passenger", passengerSchema);
