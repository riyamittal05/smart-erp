const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController");
const protect = require("../middleware/authMiddleware"); // apni file ka correct path

const router = express.Router();

router.get("/", protect, getDashboardData);

module.exports = router;