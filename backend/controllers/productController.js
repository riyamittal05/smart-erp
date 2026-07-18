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
  user: req.user.id,
  name,
  category,
  purchasePrice,
  sellingPrice,
  quantity,
  supplier,
  productCode,
  reorderLevel,
});

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Products (Only Logged-in User)
const getAllProducts = async (req, res) => {
  try {
  const products = await Product.find({
  user: req.user.id,
  isActive: true,
}).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Product (Only Logged-in User)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Product (Only Logged-in User)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
         returnDocument: "after",
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        isActive: false,
      },
      {
         returnDocument: "after",
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product archived successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};