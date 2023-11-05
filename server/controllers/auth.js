const User = require("../models/User");

// Create
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

module.exports = { register:register, editUser:editUser };