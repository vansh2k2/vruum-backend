import Offer from "../models/Offer.js";

/* ============================================================
   GET ALL OFFERS
   Sorted by `order` (lowest → highest)
============================================================ */
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ order: 1 });

    res.json({
      success: true,
      data: offers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* ============================================================
   CREATE OFFER
   Supports:
   - background
   - textColor
   - iconColor
   - couponCode
   - icon
   - order
============================================================ */
export const createOffer = async (req, res) => {
  try {
    const {
      title,
      desc,
      background,
      textColor,
      iconColor,
      couponCode,
      icon,
      order,
      active,
    } = req.body;

    const newOffer = await Offer.create({
      title,
      desc,
      background,
      textColor,
      iconColor,
      couponCode,
      icon,
      order,
      active,
    });

    res.json({
      success: true,
      data: newOffer,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ============================================================
   UPDATE OFFER
============================================================ */
export const updateOffer = async (req, res) => {
  try {
    const {
      title,
      desc,
      background,
      textColor,
      iconColor,
      couponCode,
      icon,
      order,
      active,
    } = req.body;

    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      {
        title,
        desc,
        background,
        textColor,
        iconColor,
        couponCode,
        icon,
        order,
        active,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedOffer,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ============================================================
   DELETE OFFER
============================================================ */
export const deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
