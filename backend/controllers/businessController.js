const Business = require("../models/Business");

/* ================================
   Create Business Profile
================================ */

exports.createBusiness = async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      phone,
      email,
      address,
      gstNumber,
      invoicePrefix,
      currency,
    } = req.body;
if (!shopName.trim())
  return res.status(400).json({ message: "Shop name is required" });

if (!ownerName.trim())
  return res.status(400).json({ message: "Owner name is required" });

if (!phone.trim())
  return res.status(400).json({ message: "Phone number is required" });

if (!address.trim())
  return res.status(400).json({ message: "Address is required" });
    // Check if business already exists for this user
    const existingBusiness = await Business.findOne({
      user: req.user.id,
    });

    if (existingBusiness) {
      return res.status(400).json({
        message: "Business profile already exists.",
      });
    }

    const business = await Business.create({
      user: req.user.id,
      shopName,
      ownerName,
      phone,
      email,
      address,
      gstNumber,
      invoicePrefix,
      currency,
    });

    res.status(201).json(business);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ================================
   Get Business Profile
================================ */

exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({
      user: req.user.id,
    });

    if (!business) {
      return res.status(404).json({
        message: "Business profile not found.",
      });
    }

    res.json(business);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ================================
   Update Business Profile
================================ */

exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate(
      {
        user: req.user.id,
      },
     {
  ...req.body,
  email: req.body.email?.toLowerCase(),
},
      {
         returnDocument: "after",
      }
    );

    if (!business) {
      return res.status(404).json({
        message: "Business profile not found.",
      });
    }

    res.json(business);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};