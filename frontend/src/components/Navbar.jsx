import { FaUserCircle, FaCalendarAlt, FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const today = new Date();

  const currentDate = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Username (Temporary)
  const userName = localStorage.getItem("userName") || "User";

  // Dynamic Page Title
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/products": "Products",
    "/customers": "Customers",
    "/sales": "Sales",
    "/reports": "Reports",
    "/business": "Business Profile",
  };

  const pageTitle = pageTitles[location.pathname] || "Smart ERP";

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Mobile Hamburger */}
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>

        <h2>{pageTitle}</h2>
      </div>

      <div className="navbar-right">
        <div className="date-box">
          <FaCalendarAlt />
          <span>{currentDate}</span>
        </div>

        <div className="user-box">
          <FaUserCircle className="user-icon" />
          <span>Welcome, {userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
