const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  profile_img: {
    type: String,
    default:
      "https://res.cloudinary.com/dkzqcfizf/image/upload/v1700360538/odw6r4pxcwwjm3h8oyxa.png",
  },
  maps_created: {
    type: Array,
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  isGoogle: {
    type: Boolean
  }
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
