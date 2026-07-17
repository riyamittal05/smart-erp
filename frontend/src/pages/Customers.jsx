import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiSearch, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import API from "../api/axios";
import "../styles/table.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      await API.delete(`/customers/${id}`);
      toast.success("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete customer");
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()),
  );
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage all your customers efficiently.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="add-btn" onClick={() => navigate("/add-customer")}>
            <FiPlus />
            Add Customer
          </button>
        </div>
      </div>

      <div className="table-info">
        <h3>Customer List</h3>
        <span>Showing {filteredCustomers.length} Customers</span>
      </div>

      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>

                  <td>{customer.email}</td>

                  <td>{customer.phone}</td>

                  <td>{customer.address}</td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          navigate(`/edit-customer/${customer._id}`)
                        }
                      >
                        <FiEdit />
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteCustomer(customer._id)}
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
                <td colSpan="5" className="empty-state">
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

export default Customers;
