import { useEffect, useState } from "react";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import { FiDownload } from "react-icons/fi";
import { exportToCSV } from "../utils/exportCSV";

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

  const salesForExport = (salesReport.sales || []).map((sale) => ({
    customer: sale.customer?.name || "N/A",
    date: new Date(sale.createdAt).toLocaleDateString("en-IN"),
    grandTotal: sale.grandTotal,
    profit: sale.totalProfit || 0,
    discount: sale.totalDiscount || 0,
    paymentStatus: sale.paymentStatus,
  }));

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
          <h3>Revenue Collected</h3>
          <p>
            ₹ {Number(salesReport.totalRevenue || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="report-card">
          <h3>Pending Amount</h3>
          <p>
            ₹ {Number(salesReport.pendingAmount || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="report-card">
          <h3>Total Profit</h3>
          <p>
            ₹ {Number(salesReport.totalProfit || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="report-card">
          <h3>Total Discount Given</h3>
          <p>
            ₹ {Number(salesReport.totalDiscount || 0).toLocaleString("en-IN")}
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
        <div className="report-section-header">
          <h2>Sales Report</h2>
          <button
            className="edit-btn"
            onClick={() =>
              exportToCSV(
                "sales-report.csv",
                [
                  "customer",
                  "date",
                  "grandTotal",
                  "profit",
                  "discount",
                  "paymentStatus",
                ],
                salesForExport,
              )
            }
          >
            <FiDownload />
            Export CSV
          </button>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Products</th>
              <th>Total Qty</th>
              <th>Grand Total</th>
              <th>Profit</th>
              <th>Discount</th>
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

                    <td
                      style={{
                        color:
                          (sale.totalProfit || 0) >= 0
                            ? "var(--success)"
                            : "var(--danger)",
                      }}
                    >
                      ₹ {Number(sale.totalProfit || 0).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {sale.totalDiscount > 0
                        ? `₹ ${Number(sale.totalDiscount).toLocaleString("en-IN")}`
                        : "-"}
                    </td>

                    <td>
                      <span
                        className="category-badge"
                        style={{
                          background:
                            sale.paymentStatus === "Paid"
                              ? "var(--success-bg)"
                              : "var(--warning-bg)",
                          color:
                            sale.paymentStatus === "Paid"
                              ? "var(--success)"
                              : "var(--accent-dark)",
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
                <td colSpan="7" className="empty-state">
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Products Report */}
      <div className="report-section">
        <div className="report-section-header">
          <h2>Products Report</h2>
          <button
            className="edit-btn"
            onClick={() =>
              exportToCSV(
                "products-report.csv",
                [
                  "name",
                  "category",
                  "purchasePrice",
                  "sellingPrice",
                  "quantity",
                ],
                productReport.products || [],
              )
            }
          >
            <FiDownload />
            Export CSV
          </button>
        </div>

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

      {/* Customers Report - now with purchase history */}
      <div className="report-section">
        <div className="report-section-header">
          <h2>Customers Report</h2>
          <button
            className="edit-btn"
            onClick={() =>
              exportToCSV(
                "customers-report.csv",
                ["name", "email", "phone", "totalOrders", "totalSpent"],
                customerReport.customers || [],
              )
            }
          >
            <FiDownload />
            Export CSV
          </button>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Items Purchased</th>
            </tr>
          </thead>

          <tbody>
            {customerReport.customers?.length ? (
              customerReport.customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.totalOrders}</td>
                  <td>
                    ₹ {Number(customer.totalSpent).toLocaleString("en-IN")}
                  </td>
                  <td>
                    {customer.purchasedItems?.length ? (
                      customer.purchasedItems.slice(0, 3).map((item, i) => (
                        <div key={i} style={{ fontSize: "12.5px" }}>
                          • {item.productName} × {item.quantity}
                        </div>
                      ))
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>
                        No purchases yet
                      </span>
                    )}
                    {customer.purchasedItems?.length > 3 && (
                      <div
                        style={{ fontSize: "12px", color: "var(--text-muted)" }}
                      >
                        +{customer.purchasedItems.length - 3} more
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
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
