const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  registrations: { type: Number, default: 0 },
  description: { type: String, default: "" },
  location: { type: String, default: "" },
  status: { type: String, default: "Pending" },
  reminderEmail: { type: String, default: null },
  reminderDate: { type: Date, default: null },
  reminderSent: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
