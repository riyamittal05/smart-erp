import { useEffect, useState } from "react";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

import "../styles/table.css";
import "../styles/reports.css";

const Reports = () => {
  const [salesReport, setSalesReport] = useState({});
  const [productReport, setProductReport] = useState({});
  const [customerReport, setCustomerReport] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [salesRes, productRes, customerRes] = await Promise.all([
        API.get("/reports/sales"),
        API.get("/reports/products"),
        API.get("/reports/customers"),
      ]);

      setSalesReport(salesRes.data);
      setProductReport(productRes.data);
      setCustomerReport(customerRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="reports-page">
      <div className="report-header">
        <h1>Reports Dashboard</h1>
        <p>View sales, products and customer reports.</p>
      </div>

      {/* Summary Cards */}

      <div className="report-cards">
        <div className="report-card">
          <h3>Total Sales</h3>
          <p>{salesReport.totalSales || 0}</p>
        </div>

        <div className="report-card">
          <h3>Total Revenue</h3>
          <p>
            ₹ {Number(salesReport.totalRevenue || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="report-card">
          <h3>Total Products</h3>
          <p>{productReport.totalProducts || 0}</p>
        </div>

        <div className="report-card">
          <h3>Total Customers</h3>
          <p>{customerReport.totalCustomers || 0}</p>
        </div>
      </div>

      {/* Sales Report */}

      <div className="report-section">
        <h2>Sales Report</h2>

        <table className="product-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Products</th>
              <th>Total Qty</th>
              <th>Grand Total</th>
              <th>Payment</th>
            </tr>
          </thead>

          <tbody>
            {salesReport.sales?.length ? (
              salesReport.sales.map((sale) => {
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
                          • {item.product?.name} × {item.quantity}
                        </div>
                      ))}
                    </td>

                    <td>{totalQty}</td>

                    <td>₹ {Number(sale.grandTotal).toLocaleString("en-IN")}</td>

                    <td>
                      <span
                        className="category-badge"
                        style={{
                          background:
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
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Products Report */}

      <div className="report-section">
        <h2>Products Report</h2>

        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Purchase Price</th>
              <th>Selling Price</th>
              <th>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {productReport.products?.length ? (
              productReport.products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹ {product.purchasePrice}</td>
                  <td>₹ {product.sellingPrice}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Customers Report */}

      <div className="report-section">
        <h2>Customers Report</h2>

        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>

          <tbody>
            {customerReport.customers?.length ? (
              customerReport.customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-state">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
