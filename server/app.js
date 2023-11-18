const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser")

// EXPRESS APP SETUP
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

module.exports = app