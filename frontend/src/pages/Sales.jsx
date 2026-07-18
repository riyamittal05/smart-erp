import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiDownload } from "react-icons/fi";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../styles/table.css";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await API.get("/sales");
      setSales(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load sales");
    }
  };

  const filteredSales = sales.filter((sale) => {
    const customer = sale.customer?.name?.toLowerCase() || "";

    const products =
      sale.items?.map((item) => item.product?.name?.toLowerCase()).join(" ") ||
      "";

    return (
      customer.includes(search.toLowerCase()) ||
      products.includes(search.toLowerCase())
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
      console.log(error);
      toast.error("Failed to download invoice");
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
              placeholder="Search by customer or product..."
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
              <th>Products</th>
              <th>Total Qty</th>
              <th>Grand Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => {
                const totalQty = sale.items.reduce(
                  (sum, item) => sum + Number(item.quantity),
                  0,
                );

                return (
                  <tr key={sale._id}>
                    <td>{sale.customer?.name}</td>

                    <td>
                      {sale.items.map((item, index) => (
                        <div key={index}>
                          <span className="category-badge">
                            {item.product?.name}
                          </span>{" "}
                          × {item.quantity}
                        </div>
                      ))}
                    </td>

                    <td>{totalQty}</td>

                    <td>₹ {Number(sale.grandTotal).toLocaleString("en-IN")}</td>

                    <td>
                      <span
                        className="category-badge"
                        style={{
                          backgroundColor:
                            sale.paymentStatus === "Paid"
                              ? "#d1fae5"
                              : "#fef3c7",
                          color:
                            sale.paymentStatus === "Paid"
                              ? "#065f46"
                              : "#92400e",
                        }}
                      >
                        {sale.paymentStatus}
                      </span>
                    </td>

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
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">
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
