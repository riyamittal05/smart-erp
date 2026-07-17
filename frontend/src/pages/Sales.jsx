import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiDownload } from "react-icons/fi";
import API from "../api/axios";
import "../styles/table.css";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchSales = async () => {
    try {
      const res = await API.get("/sales");
      setSales(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const filteredSales = sales.filter((sale) => {
    const customer = sale.customer?.name?.toLowerCase() || "";
    const product = sale.product?.name?.toLowerCase() || "";

    return (
      customer.includes(search.toLowerCase()) ||
      product.includes(search.toLowerCase())
    );
  });
  const downloadInvoice = async (saleId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(`/sales/invoice/${saleId}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const file = new Blob([response.data], {
        type: "application/pdf",
      });

      const fileURL = window.URL.createObjectURL(file);

      window.open(fileURL, "_blank");
    } catch (error) {
      console.error(error);
      alert("Failed to download invoice");
    }
  };
  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Sales</h1>
          <p>Manage and track all sales records.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search sales..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="add-btn" onClick={() => navigate("/add-sale")}>
            <FiPlus />
            Add Sale
          </button>
        </div>
      </div>

      <div className="table-info">
        <h3>Sales List</h3>
        <span>Showing {filteredSales.length} Sales</span>
      </div>

      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.customer?.name}</td>

                  <td>
                    <span className="category-badge">{sale.product?.name}</span>
                  </td>

                  <td>{sale.quantity}</td>

                  <td>₹ {sale.totalAmount.toLocaleString()}</td>

                  <td>{new Date(sale.createdAt).toLocaleDateString()}</td>

                  <td>
                    <button
                      className="invoice-btn"
                      onClick={() => downloadInvoice(sale._id)}
                    >
                      <FiDownload />
                      Invoice
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
