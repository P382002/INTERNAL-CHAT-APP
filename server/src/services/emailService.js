const nodemailer = require("nodemailer");

// ------------------------------
// EMAIL TRANSPORTER
// ------------------------------
const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user:
        "umapabbisetty1@gmail.com",

      pass:
        "kabuaxolqziyjtms",
    },
  });

// ------------------------------
// SEND TEST EMAIL
// ------------------------------
const sendTestEmail =
  async () => {
    try {
      const info =
        await transporter.sendMail({
          from:
            "umapabbisetty1@gmail.com",

          to:
            "umapabbisetty1@gmail.com",

          subject:
            "Internal Chat App Email Test ✅",

          html: `
            <div style="
              font-family: Arial;
              padding: 20px;
            ">
              <h2>
                Email Working Successfully ✅
              </h2>

              <p>
                Nodemailer setup is working correctly.
              </p>
            </div>
          `,
        });

      console.log(
        "Test email sent successfully"
      );

      console.log(info.messageId);

    } catch (err) {
      console.log(
        "EMAIL ERROR:",
        err
      );
    }
  };

// ------------------------------
// BIRTHDAY EMAIL
// ------------------------------
const sendBirthdayEmail =
  async (
    email,
    name
  ) => {
    try {
      await transporter.sendMail({
        from:
          "umapabbisetty1@gmail.com",

        to: email,

        subject:
          "Happy Birthday 🎉",

        html: `
          <div style="
            font-family: Arial;
            padding: 20px;
          ">
            <h2>
              Happy Birthday ${name} 🎂
            </h2>

            <p>
              Wishing you happiness,
              success, and a wonderful
              year ahead!
            </p>

            <h3>
              🎉 Have a fantastic day!
            </h3>
          </div>
        `,
      });

      console.log(
        `Birthday email sent to ${email}`
      );

    } catch (err) {
      console.log(
        "BIRTHDAY EMAIL ERROR:",
        err
      );
    }
  };

// ------------------------------
// WORK ANNIVERSARY EMAIL
// ------------------------------
const sendWorkAnniversaryEmail =
  async (
    email,
    name,
    years
  ) => {
    try {
      await transporter.sendMail({
        from:
          "umapabbisetty1@gmail.com",

        to: email,

        subject:
          "Happy Work Anniversary 🎉",

        html: `
          <div style="
            font-family: Arial;
            padding: 20px;
          ">
            <h2>
              Happy Work Anniversary ${name} 🎉
            </h2>

            <p>
              Congratulations on completing
              ${years} year${
                years > 1 ? "s" : ""
              } with the company.
            </p>

            <p>
              Thank you for your dedication,
              hard work, and contribution.
            </p>

            <h3>
              🌟 Wishing you continued success!
            </h3>
          </div>
        `,
      });

      console.log(
        `Anniversary email sent to ${email}`
      );

    } catch (err) {
      console.log(
        "ANNIVERSARY EMAIL ERROR:",
        err
      );
    }
  };

module.exports = {
  sendTestEmail,
  sendBirthdayEmail,
  sendWorkAnniversaryEmail,
};