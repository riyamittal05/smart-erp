import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import BusinessProfile from "./pages/BusinessProfile";
import Register from "./pages/Register";
import StaffInvite from "./pages/StaffInvite";

import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

import AddCustomer from "./pages/AddCustomer";
import EditCustomer from "./pages/EditCustomer";

import AddSale from "./pages/AddSale";

import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import RequireBusiness from "./components/RequireBusiness";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<RequireBusiness />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/business" element={<BusinessProfile />} />
            <Route path="/staff" element={<StaffInvite />} />

            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />

            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/edit-customer/:id" element={<EditCustomer />} />

            <Route path="/add-sale" element={<AddSale />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
