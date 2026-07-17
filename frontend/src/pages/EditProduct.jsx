import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../styles/form.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setFormData(res.data);
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
    if (!formData.name.trim()) {
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

    if (Number(formData.quantity) < 0) {
      return toast.error("Quantity cannot be negative");
    }
    try {
      await API.put(`/products/${id}`, formData);
      toast.success("Product updated successfully.");
      navigate("/products");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h2>Edit Product</h2>
          <p>Update product information.</p>
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

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/products")}
            >
              <FiArrowLeft />
              Cancel
            </button>

            <button type="submit" className="save-btn">
              <FiSave />
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
