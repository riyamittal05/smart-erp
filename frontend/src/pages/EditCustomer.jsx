import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../styles/form.css";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const res = await API.get(`/customers/${id}`);
      setFormData(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load customer");
      navigate("/customers");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return toast.error("Customer name is required");
    }

    if (!formData.email.trim()) {
      return toast.error("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      return toast.error("Enter a valid email");
    }

    if (!formData.phone.trim()) {
      return toast.error("Phone number is required");
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      return toast.error("Phone number must be 10 digits");
    }

    if (!formData.address.trim()) {
      return toast.error("Address is required");
    }
    try {
      await API.put(`/customers/${id}`, formData);
      toast.success("Customer Updated Successfully");
      navigate("/customers");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update customer");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h2>Edit Customer</h2>
          <p>Update customer information.</p>
        </div>

        <form onSubmit={handleSubmit} className="erp-form">
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Customer Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              name="phone"
              placeholder="Enter Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/customers")}
            >
              <FiArrowLeft />
              Cancel
            </button>

            <button type="submit" className="save-btn">
              <FiSave />
              Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
