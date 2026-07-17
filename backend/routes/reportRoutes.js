const express=require("express");
const router=express.Router();
const {getSalesReport,getProductsReport,getCustomersReport}=require("../controllers/reportController");
const authMiddleware=require("../middleware/authMiddleware");
router.get("/sales",authMiddleware,getSalesReport);
router.get("/products",authMiddleware,getProductsReport);
router.get("/customers",authMiddleware,getCustomersReport);

module.exports=router;
