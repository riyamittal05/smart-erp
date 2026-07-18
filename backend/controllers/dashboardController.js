const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

const getDashboardData = async (req, res) => {
  try {
    // Total Products
    const totalProducts = await Product.countDocuments({
      user: req.user.id,
      isActive: true,
    });

    // Total Customers
    const totalCustomers = await Customer.countDocuments({
      user: req.user.id,
    });

    // Total Sales
    const totalSales = await Sale.countDocuments({
      user: req.user.id,
    });

    // Total Revenue
    const revenueData = await Sale.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$grandTotal",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Low Stock Products
    const lowStock = await Product.countDocuments({
      user: req.user.id,
      quantity: {
        $gt: 0,
        $lte: 10,
      },
      isActive: true,
    });

    // Out of Stock Products
    const outOfStock = await Product.countDocuments({
      user: req.user.id,
      quantity: 0,
      isActive: true,
    });

    res.status(200).json({
      totalProducts,
      totalCustomers,
      totalSales,
      totalRevenue,
      lowStock,
      outOfStock,
    });

  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
};