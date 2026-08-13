import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../styles/form.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    // eslint-disable-next-line
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/products/${id}`);

      const product = res.data;

      setFormData({
        name: product.name || "",
        category: product.category || "",
        purchasePrice: product.purchasePrice || "",
        sellingPrice: product.sellingPrice || "",
        quantity: product.quantity || "",
        supplier: product.supplier || "",
        productCode: product.productCode || "",
        reorderLevel: product.reorderLevel ?? 10,
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to load product.");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "purchasePrice" ||
        name === "sellingPrice" ||
        name === "quantity" ||
        name === "reorderLevel"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!formData.category.trim()) {
      toast.error("Category is required");
      return false;
    }

    if (!formData.supplier.trim()) {
      toast.error("Supplier is required");
      return false;
    }

    if (Number(formData.purchasePrice) <= 0) {
      toast.error("Purchase Price must be greater than 0");
      return false;
    }

    if (Number(formData.sellingPrice) <= 0) {
      toast.error("Selling Price must be greater than 0");
      return false;
    }

    if (Number(formData.sellingPrice) < Number(formData.purchasePrice)) {
      toast.error("Selling Price cannot be less than Purchase Price");
      return false;
    }

    if (Number(formData.quantity) < 0) {
      toast.error("Quantity cannot be negative");
      return false;
    }

    if (Number(formData.reorderLevel) < 0) {
      toast.error("Reorder Level cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      await API.put(`/products/${id}`, formData);

      toast.success("Product updated successfully.");

      navigate("/products");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="form-page">
        <div className="form-card">
          <h2>Loading Product...</h2>
        </div>
      </div>
    );
  }

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

          <div className="form-group">
            <label>Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              placeholder="Enter Reorder Level"
              value={formData.reorderLevel}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/products")}
              disabled={saving}
            >
              <FiArrowLeft />
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={saving}>
              <FiSave />
              {saving ? " Updating..." : " Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
