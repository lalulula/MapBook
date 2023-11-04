const User = require("../models/User");

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

module.exports = { register:register };