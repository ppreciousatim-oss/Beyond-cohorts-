const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String },
    category: { type: String },
    type: { type: String },
    location: { type: String },
    link: { type: String },
    deadline: { type: Date },
    image: { type: String },
    applicants: [{
        fullName: { type: String },
        email: { type: String },
        phone: { type: String },
        cv: { type: String },
        appliedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Opportunity', opportunitySchema);