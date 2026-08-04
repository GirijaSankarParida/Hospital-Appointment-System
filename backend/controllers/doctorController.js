const User = require("../models/User");
const TimeSlot = require("../models/TimeSlot");

// @desc   Get all doctors (optionally filter by specialization)
// @route  GET /api/doctors?specialization=Cardiology
// @access Public
const getDoctors = async (req, res) => {
  try {
    const filter = { role: "doctor" };
    if (req.query.specialization) {
      filter.specialization = req.query.specialization;
    }
    const doctors = await User.find(filter).select("-password");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get a single doctor by id
// @route  GET /api/doctors/:id
// @access Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" }).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Doctor creates available time slots
// @route  POST /api/doctors/slots
// @access Private (doctor only)
const createTimeSlots = async (req, res) => {
  try {
    // slots: [{ date, startTime, endTime }, ...]
    const { slots } = req.body;
    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: "Provide an array of slots" });
    }

    const created = [];
    for (const slot of slots) {
      const exists = await TimeSlot.findOne({
        doctor: req.user._id,
        date: slot.date,
        startTime: slot.startTime,
      });
      if (!exists) {
        const newSlot = await TimeSlot.create({
          doctor: req.user._id,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
        created.push(newSlot);
      }
    }

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get available (unbooked) slots for a doctor, optionally filtered by date
// @route  GET /api/doctors/:id/slots?date=YYYY-MM-DD
// @access Public
const getAvailableSlots = async (req, res) => {
  try {
    const filter = { doctor: req.params.id, isBooked: false };
    if (req.query.date) filter.date = req.query.date;

    const slots = await TimeSlot.find(filter).sort({ date: 1, startTime: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Doctor deletes a slot they created (only if not booked)
// @route  DELETE /api/doctors/slots/:slotId
// @access Private (doctor only)
const deleteTimeSlot = async (req, res) => {
  try {
    const slot = await TimeSlot.findOne({ _id: req.params.slotId, doctor: req.user._id });
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.isBooked) return res.status(400).json({ message: "Cannot delete a booked slot" });

    await slot.deleteOne();
    res.json({ message: "Slot deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getDoctorById, createTimeSlots, getAvailableSlots, deleteTimeSlot };
