import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../styles/form.css";

const AddSale = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    customer: "",
    product: "",
    quantity: "",
  });

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
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
    if (Number(formData.quantity) <= 0) {
      return toast.error("Quantity must be greater than 0");
    }
    try {
      await API.post("/sales", formData);
      toast.success("Sale created successfully");
      navigate("/sales");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error creating sale");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h2>Create Sale</h2>
          <p>Create a new sales transaction.</p>
        </div>

        <form onSubmit={handleSubmit} className="erp-form">
          <div className="form-group">
            <label>Select Customer</label>

            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
            >
              <option value="">Choose Customer</option>

              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Product</label>

            <select
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
            >
              <option value="">Choose Product</option>

              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>

            <input
              type="number"
              name="quantity"
              placeholder="Enter Quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/sales")}
            >
              <FiArrowLeft />
              Cancel
            </button>

            <button type="submit" className="save-btn">
              <FiSave />
              Create Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSale;
