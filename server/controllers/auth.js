const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("../models/User");

// LOGIN
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or REGISTER
const register = async (req, res) => {
  console.log("REGISTERING IN SERVER");
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

// UPDATE
const editUser = async (req, res) => {
  try {
    const { username, password, } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { password: password },
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = { register: register, editUser: editUser, login:login };