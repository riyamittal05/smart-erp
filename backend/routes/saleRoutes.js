const express = require("express");
const {
  createSale,
  getAllSales,
  getSaleById,
  generateInvoice,
  markSaleAsPaid,
} = require("../controllers/saleController");

const router = express.Router();
const protect = require("../middleware/authMiddleware");
const requireBusiness = require("../middleware/requireBusiness");

router.post("/", protect, requireBusiness, createSale);
router.get("/", protect, requireBusiness, getAllSales);
router.get("/invoice/:saleId", protect, requireBusiness, generateInvoice);
router.patch("/:id/mark-paid", protect, requireBusiness, markSaleAsPaid);
router.get("/:id", protect, requireBusiness, getSaleById);

module.exports = router;