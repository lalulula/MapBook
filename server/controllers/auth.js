const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const User = require("../models/User");

// LOGIN
const login = async (req, res) => {
  try {
    const {
      username,
      password,
    } = req.body;

    const validUser = await User.findOne({ username: username });
    if (!validUser) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, validUser.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // make sure the password not send back to the frontend
    const { password: hashedPassword, ...user } = validUser._doc;

    const expiryDate = new Date(Date.now() + 3600000); // 1 hour cookie
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or REGISTER
const register = async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      is_admin,
      profile_img,
      maps_created
    } = req.body;

    console.log("req.body: ", req.body); //why isn't this printing
    // check for duplicate username
    const validUser = await User.findOne({ username: username });
    if (validUser) return res.status(400).json({ msg: "Username is already used." });

    // hash password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // if not, continue
    const newUser = new User({
      email,
      username,
      password: passwordHash,
      is_admin,
      profile_img,
      maps_created
    });
    const savedUser = await newUser.save();
    const { password: hashedPassword, ...user } = savedUser._doc;
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET CURRENT USER
const getUser = async (req, res) => {
  console.log(req)
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

module.exports = { register: register, editUser: editUser, login: login, getUser: getUser };