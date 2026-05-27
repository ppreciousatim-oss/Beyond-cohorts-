const express = require('express');
const {createOpportunity, getOpportunities, applyForOpportunity} = require('../controllers/opportunity');

const router = express.Router();

router.post('/', createOpportunity);
router.get('/', getOpportunities);
router.post('/:id/apply', applyForOpportunity);

module.exports = router;