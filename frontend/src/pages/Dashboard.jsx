import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/dashboard.css";

import {
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
  FaPlus,
  FaStore,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await API.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Welcome Back 👋</h2>

        <p>Manage your business, inventory and sales from one dashboard.</p>
      </div>

      <div className="cards">
        <div className="card products-card">
          <div className="card-content">
            <h3>Total Products</h3>
            <p>{stats.totalProducts}</p>
          </div>

          <div className="card-icon">
            <FaBoxOpen />
          </div>
        </div>

        <div className="card customers-card">
          <div className="card-content">
            <h3>Total Customers</h3>
            <p>{stats.totalCustomers}</p>
          </div>

          <div className="card-icon">
            <FaUsers />
          </div>
        </div>

        <div className="card sales-card">
          <div className="card-content">
            <h3>Total Sales</h3>
            <p>{stats.totalSales}</p>
          </div>

          <div className="card-icon">
            <FaShoppingCart />
          </div>
        </div>

        <div className="card revenue-card">
          <div className="card-content">
            <h3>Total Revenue</h3>
            <p>₹ {Number(stats.totalRevenue || 0).toLocaleString("en-IN")}</p>
          </div>

          <div className="card-icon">
            <FaRupeeSign />
          </div>
        </div>
        <div className="card sales-card">
          <div className="card-content">
            <h3>Pending Amount</h3>
            <p>₹ {Number(stats.pendingAmount || 0).toLocaleString("en-IN")}</p>
          </div>

          <div className="card-icon">
            <FaExclamationTriangle />
          </div>
        </div>
        <div className="card products-card">
          <div className="card-content">
            <h3>Low Stock</h3>
            <p>{stats.lowStock}</p>
          </div>

          <div className="card-icon">
            <FaExclamationTriangle />
          </div>
        </div>

        <div className="card customers-card">
          <div className="card-content">
            <h3>Out Of Stock</h3>
            <p>{stats.outOfStock}</p>
          </div>

          <div className="card-icon">
            <FaTimesCircle />
          </div>
        </div>
      </div>
      <div className="dashboard-sections">
        <div className="quick-actions">
          <h3>Quick Actions</h3>

          <div className="action-buttons">
            <button onClick={() => navigate("/add-product")}>
              <FaPlus />
              Add Product
            </button>
            <button onClick={() => navigate("/add-customer")}>
              <FaUsers />
              Add Customer
            </button>

            <button onClick={() => navigate("/add-sale")}>
              <FaShoppingCart />
              New Sale
            </button>

            <button onClick={() => navigate("/business")}>
              <FaStore />
              Business Profile
            </button>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Business Overview</h3>

          <ul>
            <li>✔ Inventory Management</li>
            <li>✔ Customer Management</li>
            <li>✔ Sales & Invoice Tracking</li>
            <li>✔ Business Profile Configuration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
