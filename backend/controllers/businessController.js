const Business = require("../models/Business");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* ================================
   Create Business Profile
================================ */

exports.createBusiness = async (req, res) => {
  try {
    const { shopName, ownerName, phone, email, address, gstNumber, invoicePrefix, currency } = req.body;
    if (!shopName?.trim()) return res.status(400).json({ message: "Shop name is required" });
    if (!ownerName?.trim()) return res.status(400).json({ message: "Owner name is required" });
    if (!phone?.trim()) return res.status(400).json({ message: "Phone number is required" });
    if (!address?.trim()) return res.status(400).json({ message: "Address is required" });

    if (req.user.businessId) {
      return res.status(400).json({ message: "Business profile already exists." });
    }

    const business = await Business.create({
      user: req.user.id, // yaha "user" field hoga, "business" nahi
      shopName, ownerName, phone, email, address, gstNumber, invoicePrefix, currency,
    });

    // Owner user ko is business se link karo
    await User.findByIdAndUpdate(req.user.id, { businessId: business._id });

    res.status(201).json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   Get Business Profile
================================ */

exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ _id: req.user.businessId });

    if (!business) {
      return res.status(404).json({ message: "Business profile not found." });
    }

    res.json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================================
   Update Business Profile
================================ */

exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate(
      { _id: req.user.businessId },
      {
        ...req.body,
        email: req.body.email?.toLowerCase(),
      },
      { new: true, runValidators: true }
    );

    if (!business) {
      return res.status(404).json({ message: "Business profile not found." });
    }

    res.json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   Invite Staff
================================ */

exports.inviteStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!req.user.businessId) {
      return res.status(400).json({ message: "Create your business profile first." });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User with this email already exists." });
    }
    const allowedRoles = ["staff", "manager"];
    const finalRole = allowedRoles.includes(role) ? role : "staff";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staffUser = await User.create({
      name, email, password: hashedPassword,
      role: finalRole, businessId: req.user.businessId,
    });

    res.status(201).json({
      message: "Staff added successfully",
      user: { id: staffUser._id, name: staffUser.name, email: staffUser.email, role: staffUser.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   Get Staff List
================================ */

exports.getStaffList = async (req, res) => {
  try {
    const staff = await User.find({
      businessId: req.user.businessId,
      _id: { $ne: req.user.id },
    }).select("-password");
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};