const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cohort: { type: String },
  role: { type: String, enum: ["admin", "user", "moderator"], default: "user" },
  isApproved: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

//  New Fixed Code
module.exports = mongoose.models.User || mongoose.model('User', userSchema);