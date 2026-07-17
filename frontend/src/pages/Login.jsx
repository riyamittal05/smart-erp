import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBoxes } from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../api/axios";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      toast.success("Login Successful 🎉");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side */}

      <div className="auth-left">
        <div className="brand-logo">
          <FaBoxes />
        </div>

        <h1>Smart ERP</h1>

        <p>Inventory & Billing Management System</p>

        <ul>
          <li>✔ Product Management</li>
          <li>✔ Customer Management</li>
          <li>✔ Sales & Billing</li>
          <li>✔ Reports & Analytics</li>
          <li>✔ Business Profile</li>
        </ul>
      </div>

      {/* Right Side */}

      <div className="auth-right">
        <form className="auth-box" onSubmit={handleLogin}>
          <h2>Welcome Back 👋</h2>

          <span>Login to continue using Smart ERP</span>

          <div className="input-group">
            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>

          <p className="auth-link">
            Don't have an account?
            <Link to="/register">Create Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
