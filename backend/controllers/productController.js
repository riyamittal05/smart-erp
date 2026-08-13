const Product = require("../models/Product");

// Create Product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      purchasePrice,
      sellingPrice,
      quantity,
      supplier,
      productCode,
      reorderLevel,
    } = req.body;

    const product = await Product.create({
      business: req.user.businessId,
      name,
      category,
      purchasePrice,
      sellingPrice,
      quantity,
      supplier,
      productCode,
      reorderLevel,
      isActive: true,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Active Products
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      business: req.user.businessId,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({
      business: req.user.businessId,
      isActive: true,
    });

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      business: req.user.businessId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        business: req.user.businessId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Archive / Restore Product
const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      business: req.user.businessId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      message: product.isActive
        ? "Product restored successfully"
        : "Product archived successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  toggleProductStatus,
};