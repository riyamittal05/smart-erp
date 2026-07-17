import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

import { FiSearch, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import API from "../api/axios";
import "../styles/table.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getProducts = async () => {
    try {
      setLoading(true);

      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  const deleteProduct = async (id) => {
    const confirmdelete = window.confirm(
      "are you sure you want to delete this product?",
    );
    if (!confirmdelete) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      getProducts();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
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

          <button className="add-btn" onClick={() => navigate("/add-product")}>
            <FiPlus />
            Add Product
          </button>
        </div>
      </div>

      <div className="table-info">
        <h3>Product List</h3>
        <span>Showing {filteredProducts.length} Products</span>
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
              filteredProducts.map((product) => (
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
                        onClick={() => deleteProduct(product._id)}
                      >
                        <FiTrash2 />
                        Delete
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
      </div>
    </div>
  );
};
export default Products;
