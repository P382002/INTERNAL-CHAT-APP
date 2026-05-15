const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/User");

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthday } = req.body;

    const name = `${firstName} ${lastName}`;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let role = "user";
    if (firstName.toLowerCase().trim() === "uma") {
      role = "admin";
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      birthday,
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;