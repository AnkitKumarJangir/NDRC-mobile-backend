const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.authEmail,
    pass: process.env.authPass,
  },
  replyTo: "noreply.ndrctrans@gmail.com",
});

async function sendMail(obj) {
  console.log(obj);
  var mailOptions = {
    from: process.env.authEmail,
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
