import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap a page with this to require login, and optionally a specific role
// Usage: <ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>
const ProtectedRoute = ({ children, role }) => {
  const { userInfo } = useAuth();

  if (!userInfo) return <Navigate to="/login" replace />;
  if (role && userInfo.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
