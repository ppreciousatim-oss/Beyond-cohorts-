const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent
} = require('../controllers/events');

const { protect } = require('../middlewares/auth');

// List all events (public)
router.get('/', getEvents);

// Get single event (public)
router.get('/:id', getEventById);

// Create event (protected)
router.post('/', protect, createEvent);

// Update event (protected)
router.put('/:id', protect, updateEvent);

// Delete event (protected)
router.delete('/:id', protect, deleteEvent);

// Approve event (protected)
router.put('/:id/approve', protect, approveEvent);

// Reject event (protected)
router.put('/:id/reject', protect, rejectEvent);

module.exports = router;
