const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const User = require("../models/User");
const Group = require("../models/Group");

// ---------------- GET USERS ----------------
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CREATE EMPLOYEE ----------------
router.post("/users/create-employee", async (req, res) => {
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

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        error: "Employee already exists",
      });
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    const user = new User({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      department,
      designation,
      birthday,
      joiningDate,
      role: "user",
    });

    await user.save();

    res.json({
      message: "Employee created successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- DELETE USER ----------------
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- EDIT USER ----------------
router.put("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);

    res.json({
      message: "User updated",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- CREATE GROUP ----------------
router.post("/groups", async (req, res) => {
  try {
    const group = new Group({
      name: req.body.name,
      members: [],
    });

    await group.save();

    res.json({
      message: "Group created",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- GET GROUPS ----------------
router.get("/groups", async (req, res) => {
  try {
    const groups = await Group.find().populate("members");

    res.json(groups);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- DELETE GROUP ----------------
router.delete("/groups/:id", async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);

    res.json({
      message: "Group deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- ADD MEMBER ----------------
router.put("/groups/:groupId/add-member", async (req, res) => {
  try {
    const { userId } = req.body;

    await Group.findByIdAndUpdate(req.params.groupId, {
      $addToSet: {
        members: userId,
      },
    });

    res.json({
      message: "Member added",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- REMOVE MEMBER ----------------
router.put("/groups/:groupId/remove-member", async (req, res) => {
  try {
    const { userId } = req.body;

    await Group.findByIdAndUpdate(req.params.groupId, {
      $pull: {
        members: userId,
      },
    });

    res.json({
      message: "Member removed",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;