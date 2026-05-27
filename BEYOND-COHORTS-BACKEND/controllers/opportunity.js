const Opportunity = require('../models/opportunity');

// Create a new opportunity
const createOpportunity = async (req,res) => {
    try{
        const { title, description, category, type, location, deadline, company, image } = req.body;
        const opportunity = await Opportunity.create({
            title,
            description,
            category,
            type,
            location,
            deadline,
            company,
            image
        });
        res.status(201).json(opportunity);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

// Get all opportunities
const getOpportunities = async (req,res) => {   
    try{
        const opportunities = await Opportunity.find();
        res.status(200).json(opportunities);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

// Apply for an opportunity
const applyForOpportunity = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, cv } = req.body;

        if (!fullName || !email || !phone) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const opportunity = await Opportunity.findByIdAndUpdate(
            id,
            {
                $push: {
                    applicants: {
                        fullName,
                        email,
                        phone,
                        cv,
                        appliedAt: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        res.status(200).json({ message: "Application submitted successfully", opportunity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOpportunity, getOpportunities, applyForOpportunity };