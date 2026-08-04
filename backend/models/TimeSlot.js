const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // format: YYYY-MM-DD
    startTime: { type: String, required: true }, // format: HH:mm (24h)
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent duplicate slots for same doctor/date/time
timeSlotSchema.index({ doctor: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
