const express = require("express");
const router = express.Router();
const {
  createBusiness, getBusiness, updateBusiness, inviteStaff, getStaffList,
} = require("../controllers/businessController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

router.post("/", protect, createBusiness);
router.get("/", protect, getBusiness);
router.put("/", protect, adminOnly, updateBusiness);
router.post("/invite-staff", protect, adminOnly, inviteStaff);
router.get("/staff", protect, adminOnly, getStaffList);

module.exports = router;