const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_E_PASS,
  },
  replyTo: "noreply.ndrctrans@gmail.com",
});

async function sendMail(obj) {
  var mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: obj.to,
    subject: obj.subject,
    text: obj.text,
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = { sendMail };
