const Event = require('../models/events');

// Create event
exports.createEvent = async (req, res) => {
  try {
    const { title, category, date, registrations, status, reminderEmail, reminderDate, description, location } = req.body;

    const event = new Event({
      title,
      category,
      date,
      registrations,
      description: description || "",
      location: location || "",
      status: status || "Pending",
      reminderEmail: reminderEmail || null,
      reminderDate: reminderDate || null,
      createdBy: req.user ? req.user.id : null
    });
    const savedEvent = await event.save();

    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { title, category, date, registrations, status, reminderEmail, reminderDate, description, location } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (title !== undefined) event.title = title;
    if (category !== undefined) event.category = category;
    if (date !== undefined) event.date = date;
    if (registrations !== undefined) event.registrations = registrations;
    if (status !== undefined) event.status = status;
    if (description !== undefined) event.description = description;
    if (location !== undefined) event.location = location;
    if (reminderEmail !== undefined) event.reminderEmail = reminderEmail;
    if (reminderDate !== undefined) {
      event.reminderDate = reminderDate;
      event.reminderSent = false;
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve event
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.status = "Approved";
    await event.save();
    res.json({ message: "Event Approved", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject event
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.status = "Rejected";
    await event.save();
    res.json({ message: "Event Rejected", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
