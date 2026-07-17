const express=require("express");
const {createSale,getAllSales,getSaleById,generateInvoice,}=require("../controllers/saleController");

const router=express.Router();          
const protect = require("../middleware/authMiddleware");
router.post("/",protect,createSale);
router.get("/",protect,getAllSales);
router.get("/invoice/:saleId",protect,generateInvoice);
router.get("/:id",protect,getSaleById);
module.exports=router;
