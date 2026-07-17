import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaChartBar,
  FaSignOutAlt,
  FaWarehouse,
  FaFileInvoiceDollar,
  FaStore,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
    },
    {
      name: "Products",
      icon: <FaBoxOpen />,
      path: "/products",
    },
    {
      name: "Customers",
      icon: <FaUsers />,
      path: "/customers",
    },
    {
      name: "Sales",
      icon: <FaShoppingCart />,
      path: "/sales",
    },
    {
      name: "Reports",
      icon: <FaChartBar />,
      path: "/reports",
    },

    // Future Modules

    // {
    //   name: "Inventory",
    //   icon: <FaWarehouse />,
    //   path: "/inventory",
    // },

    // {
    //   name: "Billing",
    //   icon: <FaFileInvoiceDollar />,
    //   path: "/billing",
    // },

    {
      name: "Business Profile",
      icon: <FaStore />,
      path: "/business",
    },

    // {
    //   name: "Settings",
    //   icon: <FaCog />,
    //   path: "/settings",
    // },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <h2 className="logo">Smart ERP</h2>
      </div>

      <nav className="menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink to={item.path}>
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
