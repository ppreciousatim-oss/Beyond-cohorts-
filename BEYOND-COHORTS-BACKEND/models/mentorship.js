const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String },
    type: { type: String },
    status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
    endDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mentorship', mentorshipSchema);