const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const auth = require("./controllers/auth")

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

app.post("/api/auth/register", auth.register)

module.exports = app;