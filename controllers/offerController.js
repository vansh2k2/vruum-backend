import Offer from "../models/Offer.js";

// GET ALL OFFERS
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ order: 1 });
    res.json({ success: true, data: offers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// CREATE OFFER
export const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.json({ success: true, data: offer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE OFFER
export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: offer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE OFFER
export const deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
