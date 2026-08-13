import { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/form.css";
import "../styles/table.css";

const StaffInvite = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = localStorage.getItem("userRole") === "admin";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data } = await API.get("/business/staff");
      setStaffList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/business/invite-staff", formData);
      toast.success("Staff added successfully 🎉");
      setFormData({ name: "", email: "", password: "", role: "staff" });
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add staff");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!isAdmin) {
    return (
      <div className="empty-state" style={{ padding: "40px" }}>
        Only the shop admin can manage staff.
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Staff Management</h1>
          <p>Add and manage your shop's staff members.</p>
        </div>
      </div>

      <div className="form-page" style={{ padding: 0, marginBottom: "28px" }}>
        <div className="form-card" style={{ maxWidth: "100%" }}>
          <div className="form-header">
            <h2>Add New Staff</h2>
            <p>Create a new staff account that can access your shop's data.</p>
          </div>

          <form onSubmit={handleSubmit} className="erp-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Staff ka naam"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="staff@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Temporary password"
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div className="form-buttons">
              <button type="submit" className="save-btn" disabled={submitting}>
                <FiUserPlus />
                {submitting ? " Adding..." : " Add Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length ? (
              staffList.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>
                    <span className="category-badge">{s.role}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty-state">
                  No staff members added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffInvite;
