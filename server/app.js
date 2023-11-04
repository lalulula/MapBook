const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// EXPRESS APP SETUP
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

module.exports = app