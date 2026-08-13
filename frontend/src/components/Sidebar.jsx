import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaChartBar,
  FaSignOutAlt,
  FaStore,
  FaUserTie,
} from "react-icons/fa";
import ConfirmModal from "./ConfirmModal";
import "../styles/confirm-modal.css";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("userRole") === "admin";
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Products", icon: <FaBoxOpen />, path: "/products" },
    { name: "Customers", icon: <FaUsers />, path: "/customers" },
    { name: "Sales", icon: <FaShoppingCart />, path: "/sales" },
    { name: "Reports", icon: <FaChartBar />, path: "/reports" },
    { name: "Business Profile", icon: <FaStore />, path: "/business" },
    ...(isAdmin
      ? [{ name: "Staff", icon: <FaUserTie />, path: "/staff" }]
      : []),
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
      <div className="logo-section">
        <h2 className="logo">Smart ERP</h2>
      </div>

      <nav className="menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink to={item.path} onClick={() => setSidebarOpen(false)}>
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="logout-container">
        <button
          className="logout-btn"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      <ConfirmModal
        open={showLogoutConfirm}
        title="Log out?"
        message="You'll need to sign in again to access your dashboard."
        confirmLabel="Logout"
        danger
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </aside>
  );
};

export default Sidebar;
