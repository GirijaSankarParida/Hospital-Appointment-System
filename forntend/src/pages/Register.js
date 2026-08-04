import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "patient",
    phone: "", specialization: "", experienceYears: "", consultationFee: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate(data.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />

        <label>Register as:</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        {form.role === "doctor" && (
          <>
            <input name="specialization" placeholder="Specialization (e.g. Cardiology)"
              value={form.specialization} onChange={handleChange} required />
            <input name="experienceYears" type="number" placeholder="Years of Experience"
              value={form.experienceYears} onChange={handleChange} />
            <input name="consultationFee" type="number" placeholder="Consultation Fee"
              value={form.consultationFee} onChange={handleChange} />
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
