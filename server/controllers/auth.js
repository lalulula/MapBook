const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const User = require("../models/User");
const ResetToken = require("../models/ResetToken");
const { log } = require("console");

// LOGIN
const login = async (req, res) => {
  if (req.body.googleCredential) {
    try {
      const client = new OAuth2Client(req.body.clientId);

      const ticket = await client.verifyIdToken({
        idToken: req.body.googleCredential,
        audience: req.body.clientId,
      });

      if (ticket) {
        const payload = ticket.getPayload();

        const username = payload.name;
        const email = payload.email;

        const existingUser = await User.findOne({
          $or: [{
            email: email
          }, {
            username: username
          }]
        });

        if (!existingUser) {
          return res.status(404).json({message: "User doesn't exist!"})
        } else {
          if (existingUser.isGoogle === false) {
            return res.status(405).json({message: "The account registered with this email has not been signed up with Google. Please sign in using the Email-Password Form."})
          }
          const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {expiresIn: "1h"});

          // make sure the password not send back to the frontend
          const { password: hashedPassword, ...user } = existingUser._doc;
            
          res
            .cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json({ token, user });
        }
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    try {
      const { username, password } = req.body;
  
      const existingUser = await User.findOne({username});

      if (!existingUser) {
        return res.status(404).json({message: "User doesn't exist!"})
      } else {
        if (existingUser.isGoogle === true) {
          return res.status(405).json({message: "The account registered with this email has been signed up with Google. Please sign in with Google."})
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
    
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
    
        // make sure the password not send back to the frontend
        const { password: hashedPassword, ...user } = existingUser._doc;
    
        const expiryDate = new Date(Date.now() + 3600); // 1 hour cookie
        res
          .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
          .status(200)
          .json({ token, user });
      }
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
          is_admin: username.toLowerCase() === "admin" ? true : false,
          profile_img,
          maps_created,
          isGoogle: true,
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
        isGoogle: false,
      });
      const savedUser = await newUser.save();
      const { password: hashedPassword, ...user } = savedUser._doc;
      return res.status(201).json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({message: "User doesn't exist!"});

    if (user.isGoogle === true) {
      return res.status(405).json({message: "The account registered with this email has been signed up with Google, so the password can not be reset. Please sign in with Google."})
    }

    const token = await ResetToken.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    const resetToken = crypto.randomBytes(32).toString("hex");

    const salt = await bcrypt.genSalt();
    const hashedResetToken = await bcrypt.hash(resetToken, salt);

    await new ResetToken({
      userId: user._id,
      token: hashedResetToken,
      createdAt: Date.now(),
    }).save();

    // const link = `http://localhost:3000/resetPassword/${resetToken}/${user._id}`;
    sendEmail(user.email,"Password Reset Request", {name: user.username, resetToken: resetToken,}, "./templates/requestResetPassword.handlebars");
    return res.status(200).json({ resetToken: resetToken, userId: user._id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const userId = req.body.userId;
    const token = req.body.resetToken;
    const password = req.body.resetPassword;

    const passwordResetToken = await ResetToken.findOne({ userId });
    if (!passwordResetToken) {
      return res.status(404).json({message: "Invalid or expired password reset token"});
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      return res.status(404).json({message: "Invalid or expired password reset token"});
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // update user's password
    await User.updateOne({ _id: userId }, { $set: { password: passwordHash } }, { new: true });

    const user = await User.findById({ _id: userId });
    console.log(user);
    sendEmail(
      user.email,
      "Password Reset Successfully",
      { name: user.username },
      "./templates/resetPassword.handlebars"
    );

    await passwordResetToken.deleteOne();

    return res.json({ success: true });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: err.message });
  }
};

const validateResetToken = async (req, res) => {
  try {
    const { resetToken, userId } = req.body;

    const passwordResetToken = await ResetToken.findOne({ userId });

    if (!passwordResetToken) {
      return res.status(404).json({message: "Invalid or expired password reset token"});
    }

    const isValid = await bcrypt.compare(resetToken, passwordResetToken.token);
    if (!isValid) {
      return res.status(404).json({message: "Invalid or expired password reset token"});
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { register: register, login: login, resetPasswordRequest: resetPasswordRequest, resetPassword: resetPassword, validateResetToken: validateResetToken  };
