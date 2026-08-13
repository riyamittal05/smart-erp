import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/layout.css";

const ProtectedLayout = () => {
  // Mobile Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  // Route change hone par mobile sidebar automatically close ho jayega
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Sidebar open hone par body scroll disable
  useEffect(() => {
    if (window.innerWidth <= 768) {
      document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  return (
    <div className="layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="main-content">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
