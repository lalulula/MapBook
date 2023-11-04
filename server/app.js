const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

const register = async (req, res) => {
  try {
    const {
    username,
    password,
    } = req.body;
    const newUser = new User({
    username,
    password,
    });
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

app.post("/api/auth/register", register)

module.exports = app;