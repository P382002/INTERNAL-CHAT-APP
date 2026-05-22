const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ======================
// WFH ALERT EMAIL
// ======================
const sendWFHAlertEmail = async (email, name, count) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "WFH Limit Alert",
      text: `Dear ${name},\n\nYou have exceeded your WFH limit. Total approved WFH days: ${count}.\n\nPlease contact HR for more information.\n\nRegards,\nHR Team`,
    });
    console.log(`WFH alert email sent to ${email}`);
  } catch (err) {
    console.log("WFH email error:", err.message);
  }
};

// ======================
// BIRTHDAY EMAIL
// ======================
const sendBirthdayEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Happy Birthday! 🎂",
      text: `Dear ${name},\n\nWishing you a very Happy Birthday! Hope you have a wonderful day.\n\nWarm regards,\nHR Team`,
    });
    console.log(`Birthday email sent to ${email}`);
  } catch (err) {
    console.log("Birthday email error:", err.message);
  }
};

// ======================
// WORK ANNIVERSARY EMAIL
// ======================
const sendWorkAnniversaryEmail = async (email, name, years) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Happy Work Anniversary! 🎉`,
      text: `Dear ${name},\n\nCongratulations on completing ${years} year(s) with us! Thank you for your dedication and hard work.\n\nWarm regards,\nHR Team`,
    });
    console.log(`Work anniversary email sent to ${email}`);
  } catch (err) {
    console.log("Anniversary email error:", err.message);
  }
};

module.exports = {
  sendWFHAlertEmail,
  sendBirthdayEmail,
  sendWorkAnniversaryEmail,
};