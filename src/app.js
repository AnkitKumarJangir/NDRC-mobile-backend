const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const main_root = require("./routers/main-root");

//  create express App
const app = express();
var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

main_root.main_root(app);

module.exports = app;
