const express = require ('express');

const { createMentorship, getMentorships } = require('../controllers/mentorship');   

const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, createMentorship);

router.get('/', getMentorships);
module.exports = router;