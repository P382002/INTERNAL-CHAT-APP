const cron = require("node-cron");

const User = require("../models/User");

const {
  sendBirthdayEmail,
  sendWorkAnniversaryEmail,
} = require("../services/emailService");

// -------------------------------------
// RUN EVERY DAY AT 9:00 AM
// -------------------------------------
cron.schedule("0 9 * * *", async () => {
  try {
    console.log("Running birthday & anniversary cron job...");

    const today = new Date();

    const todayMonth = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const todayDate = String(
      today.getDate()
    ).padStart(2, "0");

    // GET ALL USERS
    const users = await User.find();

    for (const user of users) {
      // -------------------------------------
      // BIRTHDAY MAIL
      // -------------------------------------
      if (user.birthday) {
        const birthday =
          new Date(user.birthday);

        const birthMonth = String(
          birthday.getMonth() + 1
        ).padStart(2, "0");

        const birthDate = String(
          birthday.getDate()
        ).padStart(2, "0");

        if (
          birthMonth === todayMonth &&
          birthDate === todayDate
        ) {
          await sendBirthdayEmail(
            user.email,
            `${user.firstName} ${user.lastName}`
          );

          console.log(
            `Birthday email sent to ${user.email}`
          );
        }
      }

      // -------------------------------------
      // WORK ANNIVERSARY MAIL
      // -------------------------------------
      if (user.joiningDate) {
        const joining =
          new Date(user.joiningDate);

        const joinMonth = String(
          joining.getMonth() + 1
        ).padStart(2, "0");

        const joinDate = String(
          joining.getDate()
        ).padStart(2, "0");

        if (
          joinMonth === todayMonth &&
          joinDate === todayDate
        ) {
          const years =
            today.getFullYear() -
            joining.getFullYear();

          if (years > 0) {
            await sendWorkAnniversaryEmail(
              user.email,
              `${user.firstName} ${user.lastName}`,
              years
            );

            console.log(
              `Work anniversary mail sent to ${user.email}`
            );
          }
        }
      }
    }
  } catch (err) {
    console.log(
      "Cron job error:",
      err
    );
  }
});

console.log(
  "Birthday & anniversary cron started..."
);