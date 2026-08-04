const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createTimeSlots,
  getAvailableSlots,
  deleteTimeSlot,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getDoctors);
router.post("/slots", protect, authorize("doctor"), createTimeSlots);
router.delete("/slots/:slotId", protect, authorize("doctor"), deleteTimeSlot);
router.get("/:id", getDoctorById);
router.get("/:id/slots", getAvailableSlots);

module.exports = router;
