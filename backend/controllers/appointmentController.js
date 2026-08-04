const Appointment = require("../models/Appointment");
const TimeSlot = require("../models/TimeSlot");
const Notification = require("../models/Notification");

// @desc   Patient books an appointment using an available time slot
// @route  POST /api/appointments
// @access Private (patient only)
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, timeSlotId, reason } = req.body;

    const slot = await TimeSlot.findById(timeSlotId);
    if (!slot) return res.status(404).json({ message: "Time slot not found" });
    if (slot.isBooked) return res.status(400).json({ message: "This slot is already booked" });
    if (String(slot.doctor) !== String(doctorId)) {
      return res.status(400).json({ message: "Slot does not belong to the selected doctor" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      timeSlot: slot._id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      reason,
      status: "pending",
    });

    slot.isBooked = true;
    await slot.save();

    // Notify the doctor
    await Notification.create({
      user: doctorId,
      type: "appointment_booked",
      message: `New appointment request from ${req.user.name} on ${slot.date} at ${slot.startTime}.`,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in patient's appointments
// @route  GET /api/appointments/my
// @access Private (patient only)
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name specialization")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get appointments for the logged-in doctor
// @route  GET /api/appointments/doctor
// @access Private (doctor only)
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate("patient", "name email phone")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Doctor updates appointment status (confirm / cancel / complete)
// @route  PUT /api/appointments/:id/status
// @access Private (doctor only)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body; // status: confirmed | cancelled | completed
    const appointment = await Appointment.findOne({ _id: req.params.id, doctor: req.user._id });
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status || appointment.status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    // Free up the slot again if cancelled
    if (status === "cancelled") {
      await TimeSlot.findByIdAndUpdate(appointment.timeSlot, { isBooked: false });
    }

    await Notification.create({
      user: appointment.patient,
      type: status === "confirmed" ? "appointment_confirmed" : status === "cancelled" ? "appointment_cancelled" : "general",
      message: `Your appointment on ${appointment.date} at ${appointment.startTime} was ${status}.`,
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Patient cancels their own appointment
// @route  PUT /api/appointments/:id/cancel
// @access Private (patient only)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, patient: req.user._id });
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "cancelled";
    await appointment.save();
    await TimeSlot.findByIdAndUpdate(appointment.timeSlot, { isBooked: false });

    await Notification.create({
      user: appointment.doctor,
      type: "appointment_cancelled",
      message: `Appointment with ${req.user.name} on ${appointment.date} was cancelled by the patient.`,
    });

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
};
