import OfferStrip from "../models/OfferStrip.js";

export const getOfferStrip = async (req, res) => {
  try {
    const data = await OfferStrip.findOne();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const updateOfferStrip = async (req, res) => {
  try {
    const data = await OfferStrip.findOne();

    if (data) {
      await OfferStrip.findByIdAndUpdate(data._id, req.body);
      return res.json({ msg: "Offer Strip Updated Successfully" });
    } else {
      await OfferStrip.create(req.body);
      return res.json({ msg: "Offer Strip Added Successfully" });
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
