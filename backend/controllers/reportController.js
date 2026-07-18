const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Customer = require("../models/Customer");


//sales report
// Sales Report
const getSalesReport = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customer", "name email phone")
      .populate({
        path: "items.product",
        select: "name category sellingPrice",
      });

    const totalSales = sales.length;

    const totalRevenue = sales.reduce((sum, sale) => {
      return sum + sale.grandTotal;
    }, 0);

    res.status(200).json({
      success: true,
      message: "Sales report fetched successfully",
      totalSales,
      totalRevenue,
      sales,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error fetching sales report",
      error: error.message,
    });
  }
};

//product report
const getProductsReport = async (req, res) => {
  try {

    const products = await Product.find();

    console.log("Products from DB:");
    console.log(products);
const totalProducts=products.length;
const totalStockQuantity=products.reduce((sum,product)=>{
    return sum+product.quantity;
},0);
   const lowStockProducts=products.filter((product)=>product.quantity<10);
    res.status(200).json({
        success:true,
      message: "Products report fetched successfully",
      totalProducts,
      totalStockQuantity,
      lowStockCount:lowStockProducts.length,
      lowStockProducts,
      products,
    });
  } catch (error) {
    res.status(500).json({
        success:false,
      message: "Error fetching products report",
      error:error.message,
    });
  }
};

//customer report
const getCustomersReport = async (req, res) => {
  try {

    const customers = await Customer.find();
    console.log("Customers from DB:");
    console.log(customers);
const totalCustomers=customers.length;
   
    res.status(200).json({
        success:true,
      message: "Customers report fetched successfully",
    totalCustomers,
    customers,
    });
  } catch (error) {
    res.status(500).json({
        success:false,
      message: "Error fetching customers report",
      error:error.message,
    });
  }
};

module.exports={getSalesReport,getProductsReport,getCustomersReport,};