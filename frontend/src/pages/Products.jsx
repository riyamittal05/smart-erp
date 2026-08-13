import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiArchive,
  FiDownload,
} from "react-icons/fi";
import API from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";
import { exportToCSV } from "../utils/exportCSV";
import "../styles/table.css";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 10;
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      setLoading(true);

      const res = await API.get("/products");

      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const [archiveTarget, setArchiveTarget] = useState(null);

  const archiveProduct = async () => {
    if (!archiveTarget) return;
    try {
      const res = await API.patch(`/products/toggle/${archiveTarget}`);
      toast.success(res.data.message);
      getProducts();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to archive product");
    } finally {
      setArchiveTarget(null);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchName = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory = category === "" || product.category === category;

      return matchName && matchCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);

        case "purchasePrice":
          return a.purchasePrice - b.purchasePrice;

        case "sellingPrice":
          return a.sellingPrice - b.sellingPrice;

        case "stock":
          return a.quantity - b.quantity;

        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.purchasePrice * p.quantity,
    0,
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your inventory products efficiently.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Categories</option>

            {[...new Set(products.map((p) => p.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>

            <option value="name">Name</option>

            <option value="purchasePrice">Purchase Price</option>

            <option value="sellingPrice">Selling Price</option>

            <option value="stock">Stock</option>
          </select>
          <button
            className="edit-btn"
            onClick={() =>
              exportToCSV(
                "products.csv",
                [
                  "name",
                  "category",
                  "purchasePrice",
                  "sellingPrice",
                  "quantity",
                  "supplier",
                ],
                filteredProducts,
              )
            }
          >
            <FiDownload />
            Export
          </button>

          <button className="add-btn" onClick={() => navigate("/add-product")}>
            <FiPlus />
            Add Product
          </button>
        </div>
      </div>

      <div className="table-info">
        <div>
          <h3>Product List</h3>
          <span>Showing {filteredProducts.length} Products</span>
        </div>

        <div className="table-summary">
          <strong>
            Inventory Value: ₹ {totalInventoryValue.toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Purchase Price</th>
              <th>Selling Price</th>
              <th>Stock</th>
              <th>Supplier</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>

                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>

                  <td>₹ {product.purchasePrice?.toLocaleString()}</td>

                  <td>₹ {product.sellingPrice?.toLocaleString()}</td>

                  <td>
                    <span
                      className={
                        product.quantity === 0
                          ? "stock-badge out-stock"
                          : product.quantity <= product.reorderLevel
                            ? "stock-badge low-stock"
                            : "stock-badge in-stock"
                      }
                    >
                      {product.quantity === 0
                        ? "Out of Stock"
                        : product.quantity <= product.reorderLevel
                          ? `Low (${product.quantity})`
                          : `In Stock (${product.quantity})`}
                    </span>
                  </td>

                  <td>{product.supplier}</td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/edit-product/${product._id}`)}
                      >
                        <FiEdit />
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => setArchiveTarget(product._id)}
                      >
                        <FiArchive />
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <ConfirmModal
        open={!!archiveTarget}
        title="Archive this product?"
        message="This product will be hidden from your active inventory. You can restore it later."
        confirmLabel="Archive"
        danger
        onConfirm={archiveProduct}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  );
};

export default Products;
