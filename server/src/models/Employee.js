const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,

  email: String,

  totalLeaves: {
    type: Number,
    default: 12,
  },

  usedLeaves: {
    type: Number,
    default: 0,
  },

  totalWFH: {
    type: Number,
    default: 0,
  },

  monthlyWFH: {
    type: Number,
    default: 0,
  },

  role: {
    type: String,
    default: "employee",
  },
});

module.exports = mongoose.model("Employee", employeeSchema);