const cron = require("node-cron");

const Employee = require("../models/Employee");

cron.schedule("0 0 1 * *", async () => {
  console.log("Resetting monthly WFH counts...");

  await Employee.updateMany(
    {},
    {
      monthlyWFH: 0,
    }
  );
});