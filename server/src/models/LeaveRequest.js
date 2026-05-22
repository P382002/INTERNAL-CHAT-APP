const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // FIXED: was "Employee", must be "User"
    },

    type: {
      type: String,
      enum: ["LEAVE", "WFH"],
    },

    reason: String,

    fromDate: Date,

    toDate: Date,

    status: {
      type: String,
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);