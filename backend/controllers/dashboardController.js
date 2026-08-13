const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

const getDashboardData = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({
      business: req.user.businessId,
      isActive: true,
    });

    const totalCustomers = await Customer.countDocuments({
      business: req.user.businessId,
    });

    const totalSales = await Sale.countDocuments({
      business: req.user.businessId,
    });

    // Sirf "Paid" sales ka hi revenue asli income hai
    const revenueData = await Sale.aggregate([
      {
        $match: {
          business: new mongoose.Types.ObjectId(req.user.businessId),
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$grandTotal" },
        },
      },
    ]);

    // "Pending" sales ka total = jo abhi tak collect nahi hua (receivables)
    const pendingData = await Sale.aggregate([
      {
        $match: {
          business: new mongoose.Types.ObjectId(req.user.businessId),
          paymentStatus: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          pendingAmount: { $sum: "$grandTotal" },
          pendingCount: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    const pendingAmount = pendingData.length > 0 ? pendingData[0].pendingAmount : 0;
    const pendingCount = pendingData.length > 0 ? pendingData[0].pendingCount : 0;

    const lowStock = await Product.countDocuments({
      business: req.user.businessId,
      quantity: { $gt: 0, $lte: 10 },
      isActive: true,
    });

    const outOfStock = await Product.countDocuments({
      business: req.user.businessId,
      quantity: 0,
      isActive: true,
    });

    res.status(200).json({
      totalProducts,
      totalCustomers,
      totalSales,
      totalRevenue,
      pendingAmount,
      pendingCount,
      lowStock,
      outOfStock,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData };