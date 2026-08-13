const express = require("express");
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const requireBusiness = require("../middleware/requireBusiness");

router.post("/", protect, requireBusiness, createCustomer);
router.get("/", protect, requireBusiness, getAllCustomers);
router.get("/:id", protect, requireBusiness, getCustomerById);
router.put("/:id", protect, requireBusiness, updateCustomer);
router.delete("/:id", protect, requireBusiness, deleteCustomer);

module.exports = router;