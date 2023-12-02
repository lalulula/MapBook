// const cloudinary = require("../server")
const cloudinary = require("cloudinary").v2;

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

// GET CURRENT USER by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    // console.log(user);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// GET All USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file && !req.body.username) {
      res.status(404).json({ message: "Both fields can't be empty" });
    } else if (!req.file) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          username: req.body.username,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } else if (!req.body.username) {
      cloudinary.uploader.upload(req.file.path, async function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Error",
          });
        }

        const updatedUser = await User.findByIdAndUpdate(
          id,
          {
            profile_img: result.secure_url,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      });
    } else {
      cloudinary.uploader.upload(req.file.path, async function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Error",
          });
        }

        const updatedUser = await User.findByIdAndUpdate(
          id,
          {
            username: req.body.username,
            profile_img: result.secure_url,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// REMOVE USER
const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(400).json("User not found");
    }

    res.status(200).json("User deleted successfully");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// REMOVE USERS FOR ADMIN

const adminRemoveUser = async (req, res) => {
  // console.log(req.params);
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    // return res.status(200).json(socialPost);
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

module.exports = {
  getCurrentUser: getCurrentUser,
  getAllUsers: getAllUsers,
  updateUser: updateUser,
  removeUser: removeUser,
  getUserById: getUserById,
  adminRemoveUser: adminRemoveUser,
};
