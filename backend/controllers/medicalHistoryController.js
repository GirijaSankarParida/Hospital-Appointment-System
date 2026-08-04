const MedicalHistory = require("../models/MedicalHistory");

// @desc   Doctor adds a medical history record for a patient
// @route  POST /api/medical-history
// @access Private (doctor only)
const addMedicalHistory = async (req, res) => {
  try {
    const { patientId, appointmentId, diagnosis, prescription, notes } = req.body;

    const record = await MedicalHistory.create({
      patient: patientId,
      doctor: req.user._id,
      appointment: appointmentId,
      diagnosis,
      prescription,
      notes,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Patient views their own medical history
// @route  GET /api/medical-history/my
// @access Private (patient only)
const getMyMedicalHistory = async (req, res) => {
  try {
    const records = await MedicalHistory.find({ patient: req.user._id })
      .populate("doctor", "name specialization")
      .sort({ visitDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Doctor views a specific patient's medical history
// @route  GET /api/medical-history/patient/:patientId
// @access Private (doctor only)
const getPatientMedicalHistory = async (req, res) => {
  try {
    const records = await MedicalHistory.find({ patient: req.params.patientId })
      .populate("doctor", "name specialization")
      .sort({ visitDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMedicalHistory, getMyMedicalHistory, getPatientMedicalHistory };
