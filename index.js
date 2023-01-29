const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const loadingSliproutes = require("./routers/loading_slip");
const authRoutes = require("./routers/auth");
const app = express();
// var corsOptions = {
//   origin: "http://localhost:4200",
// };

// app.use(cors(corsOptions));
// parse requests of content-type - application/json
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // simple route
// baseURL = "/api";
// app.use(baseURL + "/auth", authRoutes, (req, res) => {});
// app.use(baseURL, loadingSliproutes, (req, res) => {});
// // error handler
// //Routes go here
// app.all("*", (req, res) => {
//   res.json({ "every thing": "is awesome" });
// });
app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo! hhh");
});
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// set port, listen for requests
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
