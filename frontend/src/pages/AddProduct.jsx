import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../styles/form.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
    supplier: "",
    productCode: "",
    reorderLevel: 10,
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "productCode") {
      value = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (!formData.category.trim()) {
        return toast.error("Category is required");
      }

      if (!formData.productCode.trim()) {
        return toast.error("Product Code is required");
      }

      if (!formData.supplier.trim()) {
        return toast.error("Supplier is required");
      }
      return toast.error("Product name is required");
    }

    if (Number(formData.purchasePrice) <= 0) {
      return toast.error("Purchase Price must be greater than 0");
    }

    if (Number(formData.sellingPrice) <= 0) {
      return toast.error("Selling Price must be greater than 0");
    }

    if (Number(formData.sellingPrice) < Number(formData.purchasePrice)) {
      return toast.error("Selling Price cannot be less than Purchase Price");
    }

    if (Number(formData.quantity) < 0) {
      return toast.error("Quantity cannot be negative");
    }
    setLoading(true);
    try {
      await API.post("/products", formData);
      toast.success("Product added successfully.");
      navigate("/products");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h2>Add Product</h2>
          <p>Enter product details to add inventory.</p>
        </div>

        <form onSubmit={handleSubmit} className="erp-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              placeholder="Enter Category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Purchase Price</label>
            <input
              type="number"
              name="purchasePrice"
              placeholder="Enter Purchase Price"
              value={formData.purchasePrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Selling Price</label>
            <input
              type="number"
              name="sellingPrice"
              placeholder="Enter Selling Price"
              value={formData.sellingPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              placeholder="Enter Quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="  form-group">
            <label>Product Code</label>
            <input
              type="text"
              name="productCode"
              placeholder="Example : PRD-001"
              value={formData.productCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Supplier</label>
            <input
              type="text"
              name="supplier"
              placeholder="Enter Supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Low Stock Alert</label>
            <input
              type="number"
              name="reorderLevel"
              placeholder="Enter Low Stock Limit"
              value={formData.reorderLevel}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              disabled={loading}
              onClick={() => navigate("/products")}
            >
              <FiArrowLeft />
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              <FiSave />
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
