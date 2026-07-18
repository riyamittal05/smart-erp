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
    paymentStatus: "Paid",
    items: [
      {
        product: "",
        quantity: 1,
      },
    ],
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
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];

    updatedItems[index][field] = value;

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          product: "",
          quantity: 1,
        },
      ],
    });
  };

  const removeProduct = (index) => {
    if (formData.items.length === 1) {
      return toast.error("At least one product is required.");
    }

    const updatedItems = formData.items.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer) {
      return toast.error("Please select customer");
    }
    const selectedProducts = formData.items.map((item) => item.product);

    if (new Set(selectedProducts).size !== selectedProducts.length) {
      return toast.error("Same product cannot be added twice.");
    }
    for (const item of formData.items) {
      if (!item.product) {
        return toast.error("Please select all products");
      }

      if (Number(item.quantity) <= 0) {
        return toast.error("Quantity must be greater than zero");
      }
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
          <button
            type="button"
            className="save-btn"
            onClick={addProduct}
            style={{
              marginBottom: "20px",
            }}
          >
            + Add Product
          </button>
          <div className="form-group">
            <label>Payment Status</label>

            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
            >
              <option value="Paid">Paid</option>

              <option value="Pending">Pending</option>
            </select>
          </div>
          {formData.items.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
              }}
            >
              <h4>Product {index + 1}</h4>

              <div className="form-group">
                <label>Select Product</label>

                <select
                  value={item.product}
                  onChange={(e) =>
                    handleItemChange(index, "product", e.target.value)
                  }
                  required
                >
                  <option value="">Choose Product</option>

                  {products
                    .filter((product) => product.quantity > 0)
                    .map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} | Rs. {product.sellingPrice} | Stock:{" "}
                        {product.quantity}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity</label>

                <input
                  type="number"
                  min="1"
                  required
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                />
              </div>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => removeProduct(index)}
              >
                Remove Product
              </button>
            </div>
          ))}
          <div
            style={{
              textAlign: "right",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Grand Total: Rs.{" "}
            {formData.items.reduce((total, item) => {
              const product = products.find((p) => p._id === item.product);

              if (!product) return total;

              return (
                total + Number(product.sellingPrice) * Number(item.quantity)
              );
            }, 0)}
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
