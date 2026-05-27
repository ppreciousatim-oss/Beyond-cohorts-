const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register admin
// NOTE: The Admin model already hashes the password via a pre-save hook,
// so we do NOT hash it manually here.
exports.createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existing = await Admin.findOne({ username: username.trim() });
    if (existing) {
      return res.status(400).json({ message: "Admin username already exists" });
    }

    // Pass raw password — the model's pre-save hook will hash it
    const admin = new Admin({ username: username.trim(), password });
    await admin.save();

    res.json({ message: "Admin registered successfully", admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: "Error registering admin", error: err.message });
  }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) return res.status(401).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: `Admin ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
