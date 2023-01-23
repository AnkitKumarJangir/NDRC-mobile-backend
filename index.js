const express = require("express");
const cors = require("cors");
const mongoose = require("./db.js");
const loadingSliproutes = require("./routers/loading_slip");
const authRoutes = require("./routers/auth");
const app = express();
var corsOptions = {
  origin: "http://localhost:4200",
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
app.use((err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
