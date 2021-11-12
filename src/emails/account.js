const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendWelcomeEmail = (email, name) => {
  transporter.sendMail(
    {
      from: `Admin <4dminPWDHshop@gmail.com>`,
      to: `${email}`,
      subject: `Thanks for joining in!`,
      text: `Welcome to the app, ${name}. Let me know how get along with the app.`,
    },
    (err, info) => {
      console.log(err);
    }
  );
};

const sendCancelationEmail = (email, name) => {
  transporter.sendMail(
    {
      from: `Admin <4dminPWDHshop@gmail.com>`,
      to: `${email}`,
      subject: `Sorry to see you go!`,
      text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
    },
    (err, info) => {
      console.log(err);
    }
  );
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
