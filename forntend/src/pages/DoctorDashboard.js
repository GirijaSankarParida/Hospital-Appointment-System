import { useEffect, useState } from "react";
import api from "../api/axios";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [slotDate, setSlotDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  const fetchAppointments = async () => {
    const { data } = await api.get("/appointments/doctor");
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/doctors/slots", { slots: [{ date: slotDate, startTime, endTime }] });
      setMessage("Time slot added!");
      setSlotDate(""); setStartTime(""); setEndTime("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not add slot");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    fetchAppointments();
  };

  return (
    <div className="dashboard">
      <h2>Add Available Time Slot</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleAddSlot} className="inline-form">
        <input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} required />
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        <button type="submit">Add Slot</button>
      </form>

      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.patient?.name}</td>
                <td>{a.date}</td>
                <td>{a.startTime} - {a.endTime}</td>
                <td>{a.reason}</td>
                <td><span className={`status status-${a.status}`}>{a.status}</span></td>
                <td>
                  {a.status === "pending" && (
                    <>
                      <button onClick={() => handleStatusUpdate(a._id, "confirmed")}>Confirm</button>
                      <button onClick={() => handleStatusUpdate(a._id, "cancelled")}>Reject</button>
                    </>
                  )}
                  {a.status === "confirmed" && (
                    <button onClick={() => handleStatusUpdate(a._id, "completed")}>Mark Completed</button>
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

export default DoctorDashboard;
