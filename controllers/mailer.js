const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: process.env.EMAIL_HOST,
  port: 465,
  secureConnection: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_E_PASS,
  },
  replyTo: "noreply.ndrctrans@gmail.com",
});
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
function sendMail(obj) {
  var mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: obj.to,
    subject: obj.subject,
    html: obj.html,
  };
  new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve("email sent");
      }
    });
  });
}

module.exports = { sendMail };
