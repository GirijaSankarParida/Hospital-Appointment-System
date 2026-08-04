import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import BookAppointment from "./pages/BookAppointment";
import MedicalHistory from "./pages/MedicalHistory";
import Notifications from "./pages/Notifications";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/patient/dashboard" element={
              <ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>
            } />
            <Route path="/patient/book" element={
              <ProtectedRoute role="patient"><BookAppointment /></ProtectedRoute>
            } />
            <Route path="/patient/history" element={
              <ProtectedRoute role="patient"><MedicalHistory /></ProtectedRoute>
            } />

            <Route path="/doctor/dashboard" element={
              <ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>
            } />

            <Route path="/notifications" element={
              <ProtectedRoute><Notifications /></ProtectedRoute>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
