import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/business.css";

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
      // 404 means profile doesn't exist yet
      if (err.response?.status !== 404) {
        console.log(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, []);
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

        alert("Business Profile Updated Successfully");
      } else {
        await API.post("/business", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Business Profile Saved Successfully");
        setIsUpdate(true);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="business-page">
      <h2>Business Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="shopName"
          value={formData.shopName}
          placeholder="Shop Name"
          onChange={handleChange}
          required
        />

        <input
          name="ownerName"
          value={formData.ownerName}
          placeholder="Owner Name"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          value={formData.phone}
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
        />

        <textarea
          name="address"
          value={formData.address}
          placeholder="Business Address"
          onChange={handleChange}
          required
        />

        <input
          name="gstNumber"
          value={formData.gstNumber}
          placeholder="GST Number"
          onChange={handleChange}
        />

        <input
          name="businessType"
          value={formData.businessType}
          placeholder="Business Type"
          onChange={handleChange}
        />

        <input
          name="invoicePrefix"
          placeholder="Invoice Prefix"
          onChange={handleChange}
          value={formData.invoicePrefix}
        />
        <button type="submit">
          {isUpdate ? "Update Business" : "Save Business"}
        </button>
      </form>
    </div>
  );
};

export default BusinessProfile;
