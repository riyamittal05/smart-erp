const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const getSalesReport = async (req, res) => {
  try {
    const sales = await Sale.find({ business: req.user.businessId })
      .populate("customer", "name email")
      .populate({ path: "items.product", select: "name category sellingPrice" })
      .sort({ createdAt: -1 });

    const totalSales = sales.length;

    const paidSales = sales.filter((s) => s.paymentStatus === "Paid");
    const pendingSales = sales.filter((s) => s.paymentStatus === "Pending");

    const totalRevenue = paidSales.reduce((sum, sale) => sum + sale.grandTotal, 0);
    const pendingAmount = pendingSales.reduce((sum, sale) => sum + sale.grandTotal, 0);
    const totalProfit = paidSales.reduce((sum, sale) => sum + (sale.totalProfit || 0), 0);
    const totalDiscount = sales.reduce((sum, sale) => sum + (sale.totalDiscount || 0), 0);

    res.status(200).json({
      success: true,
      message: "Sales report fetched successfully",
      totalSales,
      totalRevenue,
      pendingAmount,
      pendingCount: pendingSales.length,
      totalProfit,
      totalDiscount,
      sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sales report",
      error: error.message,
    });
  }
};

const getProductsReport = async (req, res) => {
  try {
    const products = await Product.find({
      business: req.user.businessId,
      isActive: true,
    });

    const totalProducts = products.length;
    const totalStockQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalStockValue = products.reduce(
      (sum, p) => sum + p.quantity * p.purchasePrice,
      0
    );
    const lowStockProducts = products.filter((p) => p.quantity < 10);

    res.status(200).json({
      success: true,
      message: "Products report fetched successfully",
      totalProducts,
      totalStockQuantity,
      totalStockValue,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products report",
      error: error.message,
    });
  }
};

const getCustomersReport = async (req, res) => {
  try {
    const customers = await Customer.find({ business: req.user.businessId });

    const sales = await Sale.find({ business: req.user.businessId }).populate({
      path: "items.product",
      select: "name category",
    });

    const customerSummary = customers.map((customer) => {
      const customerSales = sales.filter(
        (sale) => String(sale.customer) === String(customer._id)
      );

      const totalSpent = customerSales.reduce((sum, s) => sum + s.grandTotal, 0);
      const totalOrders = customerSales.length;

      const purchasedItems = [];
      customerSales.forEach((sale) => {
        sale.items.forEach((item) => {
          purchasedItems.push({
            productName: item.product?.name || "Deleted Product",
            category: item.product?.category || "-",
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            date: sale.createdAt,
          });
        });
      });

      return {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        totalOrders,
        totalSpent,
        purchasedItems,
      };
    });

    res.status(200).json({
      success: true,
      message: "Customers report fetched successfully",
      totalCustomers: customers.length,
      customers: customerSummary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching customers report",
      error: error.message,
    });
  }
};

module.exports = { getSalesReport, getProductsReport, getCustomersReport };