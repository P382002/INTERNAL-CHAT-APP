const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const User = require("../models/User");

// ---------------- GET USERS ----------------
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.log("GET USERS ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ---------------- CREATE EMPLOYEE ----------------
router.post("/create-employee", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      department,
      designation,
      birthday,
      joiningDate,
    } = req.body;

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Employee already exists",
      });
    }

    // AUTO PASSWORD
    const autoPassword = firstName + "@123";

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(autoPassword, salt);

    // CREATE USER
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      department,
      designation,
      birthday,
      joiningDate,
    });

    await user.save();

    res.json({
      success: true,
      message: "Employee created successfully",
      generatedPassword: autoPassword,
    });
  } catch (err) {
    console.log("CREATE EMPLOYEE ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ---------------- UPDATE EMPLOYEE (NEW) ----------------
router.put("/:id", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      department,
      designation,
      birthday,
      joiningDate,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        department,
        designation,
        birthday,
        joiningDate,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.log("UPDATE EMPLOYEE ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ---------------- DELETE EMPLOYEE ----------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    console.log("DELETE EMPLOYEE ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;