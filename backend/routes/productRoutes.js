const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  toggleProductStatus,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");

// Create Product
router.post("/", protect, createProduct);

// Get All Active Products
router.get("/", protect, getAllProducts);

// Get Single Product
router.get("/:id", protect, getProductById);

// Update Product
router.put("/:id", protect, updateProduct);

// Archive / Restore Product
router.patch("/toggle/:id", protect, toggleProductStatus);


module.exports = router;