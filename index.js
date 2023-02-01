const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
var mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const loadingSliproutes = require("./routers/loading_slip");
const authRoutes = require("./routers/auth");
const app = express();
var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// simple route
baseURL = "/api";
app.use(baseURL + "/auth", authRoutes, (req, res) => {});
app.use(baseURL, loadingSliproutes, (req, res) => {});
// error handler
const PORT = process.env.PORT || 3000;
// log
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
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
// set port, listen for requests
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
