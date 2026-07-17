const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const saleRoutes=require("./routes/saleRoutes");
const dashboardRoutes=require("./routes/dashboardRoutes");
const reportRoutes=require("./routes/reportRoutes");
const businessRoutes = require("./routes/businessRoutes");
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports",reportRoutes);
app.use("/api/business", businessRoutes);

app.get("/", (req, res) => {
    res.send("ERP Backend working");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});