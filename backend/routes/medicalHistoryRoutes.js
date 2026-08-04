const express = require("express");
const router = express.Router();
const {
  addMedicalHistory,
  getMyMedicalHistory,
  getPatientMedicalHistory,
} = require("../controllers/medicalHistoryController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("doctor"), addMedicalHistory);
router.get("/my", protect, authorize("patient"), getMyMedicalHistory);
router.get("/patient/:patientId", protect, authorize("doctor"), getPatientMedicalHistory);

module.exports = router;
