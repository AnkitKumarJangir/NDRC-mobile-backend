const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const main_root = require("./routers/main-root");

//  create express App
const app = express();
var corsOptions = {
  "origin": ["http://localhost:4200","http://64.227.147.224"],
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

main_root.main_root(app);

module.exports = app;
