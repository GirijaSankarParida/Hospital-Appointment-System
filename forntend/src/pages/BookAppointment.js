import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/doctors").then(({ data }) => setDoctors(data));
  }, []);

  const fetchSlots = async (doctorId, chosenDate) => {
    if (!doctorId || !chosenDate) return;
    const { data } = await api.get(`/doctors/${doctorId}/slots`, { params: { date: chosenDate } });
    setSlots(data);
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    setSelectedSlot("");
    fetchSlots(e.target.value, date);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedSlot("");
    fetchSlots(selectedDoctor, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/appointments", {
        doctorId: selectedDoctor,
        timeSlotId: selectedSlot,
        reason,
      });
      setMessage("Appointment booked successfully!");
      setTimeout(() => navigate("/patient/dashboard"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Book an Appointment</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Doctor</label>
        <select value={selectedDoctor} onChange={handleDoctorChange} required>
          <option value="">-- Select Doctor --</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>
          ))}
        </select>

        <label>Date</label>
        <input type="date" value={date} onChange={handleDateChange} required />

        <label>Available Time Slots</label>
        <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} required>
          <option value="">-- Select Slot --</option>
          {slots.map((s) => (
            <option key={s._id} value={s._id}>{s.startTime} - {s.endTime}</option>
          ))}
        </select>
        {selectedDoctor && date && slots.length === 0 && <p>No available slots for this date.</p>}

        <label>Reason for visit</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />

        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
};

export default BookAppointment;
