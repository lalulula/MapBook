const User = require("../models/User");

// GET CURRENT USER
const getCurrentUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
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

module.exports = { editUser: editUser, getCurrentUser: getCurrentUser };