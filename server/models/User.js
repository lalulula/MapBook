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
    default: "",
  },
  maps_created: {
    type: Array,
    default: [],
  },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
