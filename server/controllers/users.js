const User = require("../models/User");

const ObjectID = require("mongoose").Types.ObjectId;

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
    const { id } = req.params;

    if (!ObjectID.isValid(id))
      return res.status(400).send("ID unknown : " + id);

    const updatedUser = await User.findByIdAndUpdate(id, 
      { username: req.body.username}, 
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = { editUser: editUser, getCurrentUser: getCurrentUser };