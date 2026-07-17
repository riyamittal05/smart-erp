const express = require("express");
const router = express.Router();

const {
  createBusiness,
  getBusiness,
  updateBusiness,
} = require("../controllers/businessController");

const protect = require("../middleware/authMiddleware");

// Create Business Profile
router.post("/", protect, createBusiness);

// Get Business Profile
router.get("/", protect, getBusiness);

// Update Business Profile
router.put("/", protect, updateBusiness);

module.exports = router;