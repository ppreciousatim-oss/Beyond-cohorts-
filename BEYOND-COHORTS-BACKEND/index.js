
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
require('dotenv').config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/posts");
const mentorshipRoutes = require("./routes/mentorship");
const opportunityRoutes = require("./routes/opportunities");
const eventRoutes = require("./routes/events");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/mentorships", mentorshipRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to BEYOND COHORTS");
});

// ─── Reminder cron job ────────────────────────────────────────────────────────
// Runs every 15 minutes. Sends email reminders for events whose reminderDate
// falls within the next 15-minute window and have not yet been sent.
// Requires SMTP settings in .env:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
async function startReminderJob() {
  try {
    const cron = require('node-cron');
    const nodemailer = require('nodemailer');
    const Event = require('./models/events');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Runs every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      try {
        const now = new Date();
        const windowEnd = new Date(now.getTime() + 15 * 60 * 1000);

        const events = await Event.find({
          reminderDate: { $gte: now, $lte: windowEnd },
          reminderSent: false,
          reminderEmail: { $ne: null },
        });

        for (const event of events) {
          try {
            await transporter.sendMail({
              from: process.env.SMTP_FROM || process.env.SMTP_USER,
              to: event.reminderEmail,
              subject: `Reminder: ${event.title}`,
              html: `
                <h2>Event Reminder</h2>
                <p>This is a reminder for the upcoming event:</p>
                <ul>
                  <li><strong>Title:</strong> ${event.title}</li>
                  <li><strong>Category:</strong> ${event.category}</li>
                  <li><strong>Date:</strong> ${event.date}</li>
                  <li><strong>Status:</strong> ${event.status}</li>
                </ul>
              `,
            });

            event.reminderSent = true;
            await event.save();
            console.log(`Reminder sent for event: ${event.title} → ${event.reminderEmail}`);
          } catch (mailErr) {
            console.error(`Failed to send reminder for event ${event._id}:`, mailErr.message);
          }
        }
      } catch (err) {
        console.error('Reminder cron error:', err.message);
      }
    });

    console.log('✅ Reminder cron job started (every 15 minutes)');
  } catch (err) {
    console.warn('⚠️  Reminder job skipped — install node-cron and nodemailer to enable:', err.message);
  }
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  connectDB().then(() => {
    startReminderJob();
  });
});
