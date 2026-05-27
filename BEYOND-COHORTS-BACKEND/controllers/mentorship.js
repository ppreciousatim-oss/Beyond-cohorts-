const Mentorship = require('../models/mentorship');

// Create a new mentorship  
const createMentorship = async (req, res) => {
    try{
        const{type,endate} = req.body;
        const mentorship = await Mentorship.create({
           user:req.user._id,
            type,
            endate});   
        res.status(201).json(mentorship);
    } catch (error) {
        res.status(500).json({message:error.message});
    }   
};

// Get all mentorships
const getMentorships = async (req, res) => {
    try{        
        const mentorships = await Mentorship.find()
        .populate('mentor', 'fullName email');
        res.status(200).json(mentorships);
    } catch (error) {
        res.status(500).json({message:error.message});
    }   
};

module.exports = { createMentorship, getMentorships };