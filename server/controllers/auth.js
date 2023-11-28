const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const axios = require("axios");
const { OAuth2Client } = require('google-auth-library');

const User = require("../models/User");

// LOGIN
const login = async (req, res) => {
  if (req.body.googleAccessToken) {
    const {googleAccessToken} = req.body;
    const { username, password, email } = req.body;

    axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        "Authorization": `Bearer ${googleAccessToken}`
      }
    }).then(async response => {

      const existingUser = await User.findOne({
        $or: [{
          email: email
        }, {
          username: username
        }]
      });

      if (!existingUser) 
        return res.status(404).json({message: "User doesn't exist!"})

      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {expiresIn: "1h"});

      // make sure the password not send back to the frontend
      const { password: hashedPassword, ...user } = existingUser._doc;
        
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({ token, user });
                    
    }).catch(err => {
      res.status(400).json({message: "Invalid access token!"})
    })
  } else {
    try {
      const { username, password } = req.body;
  
      const existingUser = await User.findOne({username});

      if (!existingUser) 
        return res.status(404).json({message: "User doesn't exist!"})
  
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
  
      // make sure the password not send back to the frontend
      const { password: hashedPassword, ...user } = existingUser._doc;
  
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour cookie
      res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

// Create or REGISTER
const register = async (req, res) => {
  if (req.body.googleCredential) {
    try {
      const client = new OAuth2Client(req.body.clientId);

      const ticket = await client.verifyIdToken({
        idToken: req.body.googleCredential,
        audience: req.body.clientId,
      });
      
      if (ticket) {
        const payload = ticket.getPayload();

        // hash password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(payload.jti, salt);

        const username = payload.name;
        const email = payload.email;
        console.log(email);

        const { is_admin, maps_created } = req.body;
        const profile_img = payload.picture;

        const existingUser = await User.findOne({
          $or: [{
            email: email
          }, {
            username: username
          }]
        });

        if (existingUser) 
          return res.status(400).json({message: "User already exist!"});

        const newUser = new User({
          email,
          username,
          password: passwordHash,
          is_admin,
          profile_img,
          maps_created,
        });
        const savedUser = await newUser.save();
        const { password: hashedPassword, ...user } = savedUser._doc;

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {expiresIn: "1h"});
          
        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json({ token, user });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    try {
      const { email, username, password, is_admin, profile_img, maps_created } =
        req.body;
  
      // check for duplicate username or email
      const existingUser = await User.findOne({
        $or: [{
          email: email
        }, {
          username: username
        }]
      });

      if (existingUser)
        return res.status(400).json({ msg: "Username is already used." });
  
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
        maps_created,
      });
      const savedUser = await newUser.save();
      const { password: hashedPassword, ...user } = savedUser._doc;
      return res.status(201).json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

module.exports = { register: register, login: login };
