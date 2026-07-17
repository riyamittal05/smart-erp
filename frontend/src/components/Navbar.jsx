import { FaUserCircle, FaCalendarAlt } from "react-icons/fa";

const Navbar = () => {
  const today = new Date();

  const currentDate = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2>Dashboard Overview</h2>
      </div>

      <div className="navbar-right">
        <div className="date-box">
          <FaCalendarAlt />
          <span>{currentDate}</span>
        </div>

        <div className="user-box">
          <FaUserCircle className="user-icon" />
          <span>Welcome, User</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
