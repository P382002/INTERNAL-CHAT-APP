const express = require("express");
const LeaveRequest = require("../models/LeaveRequest");
const { sendWFHAlertEmail } = require("../services/emailService");

module.exports = (io) => {
  const router = express.Router();

  // ======================
  // CREATE REQUEST
  // ======================
  router.post("/request", async (req, res) => {
    try {
      const leave = await LeaveRequest.create(req.body);

      io.emit("refresh_leave_requests");

      res.json({ success: true, leave });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false });
    }
  });

  // ======================
  // GET ALL REQUESTS
  // ======================
  router.get("/all", async (req, res) => {
    try {
      const requests = await LeaveRequest.find()
        .populate("employeeId") // works now because ref is "User"
        .sort({ createdAt: -1 });

      res.json(requests);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false });
    }
  });

  // ======================
  // UPDATE REQUEST (APPROVE / REJECT)
  // ======================
  router.put("/update/:id", async (req, res) => {
    try {
      const { status } = req.body;

      // populate employeeId so we get firstName, lastName, email
      const leave = await LeaveRequest.findById(req.params.id).populate(
        "employeeId"
      );

      if (!leave) {
        return res.status(404).json({ success: false, error: "Request not found" });
      }

      // Safety check — if populate failed for any reason
      if (!leave.employeeId) {
        return res.status(400).json({ success: false, error: "Employee not found" });
      }

      leave.status = status;
      await leave.save();

      const employee = leave.employeeId;
      const employeeName = `${employee.firstName || ""} ${employee.lastName || ""}`.trim();

      // ======================
      // NOTIFY EMPLOYEE
      // ======================
      io.emit("employee-notification", {
        employeeId: employee._id.toString(),
        message: `Your ${leave.type} request has been ${status}`,
      });

      // ======================
      // NOTIFY HR
      // ======================
      io.emit("hr-alert", {
        message: `${employeeName}'s ${leave.type} request was ${status}`,
      });

      // ======================
      // WFH LIMIT CHECK (fires at 3 or more)
      // ======================
      if (leave.type === "WFH" && status === "APPROVED") {
        const count = await LeaveRequest.countDocuments({
          employeeId: employee._id,
          type: "WFH",
          status: "APPROVED",
        });

        if (count >= 3) {
          // Alert HR via socket
          io.emit("hr-alert", {
            message: `⚠️ ${employeeName} has used ${count} WFH day(s) this month!`,
          });

          // Send email alert to employee
          await sendWFHAlertEmail(employee.email, employeeName, count);
        }
      }

      // Refresh UI
      io.emit("refresh_leave_requests");

      res.json({ success: true });
    } catch (err) {
      console.log("UPDATE LEAVE ERROR:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ======================
  // STATS
  // ======================
  router.get("/stats/:employeeId", async (req, res) => {
    try {
      const approvedLeaves = await LeaveRequest.countDocuments({
        employeeId: req.params.employeeId,
        type: "LEAVE",
        status: "APPROVED",
      });

      const approvedWFH = await LeaveRequest.countDocuments({
        employeeId: req.params.employeeId,
        type: "WFH",
        status: "APPROVED",
      });

      res.json({
        totalLeaves: 12,
        usedLeaves: approvedLeaves,
        remainingLeaves: 12 - approvedLeaves,
        approvedWFH,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false });
    }
  });

  return router;
};