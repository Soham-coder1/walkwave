const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");     
require("dotenv").config({path:path.join(__dirname,".env")});
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

  
// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact form API
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Store in MongoDB (create user if not exists)
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, subject, message });
      await user.save();
    } else {
      // If already registered, just update latest message
      user.subject = subject;
      user.message = message;
      await user.save();
    }

    // Send email notification
    await transporter.sendMail({
      from: `"WALKwave Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `From: ${name} (${email})\nSubject: ${subject}\n\n${message}`,
    });

    res.json({ success: true, message: "Message sent & stored successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token, redirect: "dashboard.html" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// -------------------- LOGIN --------------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token, redirect: "dashboard.html" });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
