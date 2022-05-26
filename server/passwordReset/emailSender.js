const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || "gmail",
  port: process.env.NODEMAIL_PORT,
  auth: {
    user: process.env.NODEMAIL_EMAIL,
    pass: process.env.NODEMAIL_PASSWORD,
  },
  secure: true,
});

module.exports = transport;
