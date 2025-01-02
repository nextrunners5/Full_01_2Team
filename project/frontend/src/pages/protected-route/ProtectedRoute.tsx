import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/LoginPage" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
