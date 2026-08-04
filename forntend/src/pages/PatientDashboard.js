import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/my");
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    await api.put(`/appointments/${id}/cancel`);
    fetchAppointments();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>My Appointments</h2>
        <Link to="/patient/book" className="btn-primary">+ Book New Appointment</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>You have no appointments yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.doctor?.name} ({a.doctor?.specialization})</td>
                <td>{a.date}</td>
                <td>{a.startTime} - {a.endTime}</td>
                <td>{a.reason}</td>
                <td><span className={`status status-${a.status}`}>{a.status}</span></td>
                <td>
                  {["pending", "confirmed"].includes(a.status) && (
                    <button onClick={() => handleCancel(a._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientDashboard;
