import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Hospital Appointment System</Link>
      <div className="nav-links">
        {!userInfo && <Link to="/login">Login</Link>}
        {!userInfo && <Link to="/register">Register</Link>}

        {userInfo && userInfo.role === "patient" && (
          <>
            <Link to="/patient/dashboard">Dashboard</Link>
            <Link to="/patient/book">Book Appointment</Link>
            <Link to="/patient/history">Medical History</Link>
            <Link to="/notifications">Notifications</Link>
          </>
        )}

        {userInfo && userInfo.role === "doctor" && (
          <>
            <Link to="/doctor/dashboard">Dashboard</Link>
            <Link to="/notifications">Notifications</Link>
          </>
        )}

        {userInfo && (
          <button onClick={handleLogout} className="logout-btn">
            Logout ({userInfo.name})
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
