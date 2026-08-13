import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireBusiness = () => {
  const businessId = localStorage.getItem("businessId");
  const role = localStorage.getItem("userRole");
  const location = useLocation();

  const isOwnerWithoutBusiness = role === "admin" && !businessId;

  if (isOwnerWithoutBusiness && location.pathname !== "/business") {
    return <Navigate to="/business" replace />;
  }

  return <Outlet />;
};

export default RequireBusiness;
