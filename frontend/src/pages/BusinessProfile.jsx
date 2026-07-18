import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { toast } from "react-toastify";
import API from "../api/axios";
import "../styles/form.css";

const BusinessProfile = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
    businessType: "",
    invoicePrefix: "INV",
    currency: "₹",
    invoiceFooter: "Thank you for shopping with us!",
  });

  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/business", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        shopName: data.shopName || "",
        ownerName: data.ownerName || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        gstNumber: data.gstNumber || "",
        businessType: data.businessType || "",
        invoicePrefix: data.invoicePrefix || "INV",
        currency: data.currency || "₹",
        invoiceFooter: data.invoiceFooter || "Thank you for shopping with us!",
      });

      setIsUpdate(true);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.log(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (isUpdate) {
        await API.put("/business", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Business Profile Updated Successfully");
      } else {
        await API.post("/business", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Business Profile Saved Successfully");
        setIsUpdate(true);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h2>
    );
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h2>Business Profile</h2>
          <p>Manage your business information for invoices.</p>
        </div>

        <form onSubmit={handleSubmit} className="erp-form">
          <div className="form-group">
            <label>Shop Name</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="Enter Shop Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Enter Owner Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
            />
          </div>

          <div className="form-group">
            <label>Business Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Business Address"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="Enter GST Number"
            />
          </div>

          <div className="form-group">
            <label>Business Type</label>
            <input
              type="text"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              placeholder="Retail / Wholesale / Medical / etc."
            />
          </div>

          <div className="form-group">
            <label>Invoice Prefix</label>
            <input
              type="text"
              name="invoicePrefix"
              value={formData.invoicePrefix}
              onChange={handleChange}
              placeholder="INV"
            />
          </div>

          <div className="form-group">
            <label>Currency</label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              placeholder="₹"
            />
          </div>

          <div className="form-group">
            <label>Invoice Footer</label>
            <textarea
              name="invoiceFooter"
              value={formData.invoiceFooter}
              onChange={handleChange}
              rows="3"
              placeholder="Thank you for shopping with us!"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              <FiSave />
              {isUpdate ? " Update Business" : " Save Business"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfile;
