// const cloudinary = require("../server")
const cloudinary = require('cloudinary').v2;

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

// UPDATE USER
const updateUser = (req, res) => {
  try {
    const { id } = req.params;

    cloudinary.uploader.upload(req.file.path, async function (err, result) {
      if(err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error"
        })
      }
      
      const updatedUser = await User.findByIdAndUpdate(id, 
        { 
          username: req.body.username,
          profile_img: result.secure_url,
        }, 
        { new: true }
      );

      res.status(200).json(updatedUser);
    })
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = { getCurrentUser: getCurrentUser, updateUser: updateUser };