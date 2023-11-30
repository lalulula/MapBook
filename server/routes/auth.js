const express = require("express");
const auth = require("../controllers/auth.js")

const router = express.Router();

// LOGIN
router.post("/login", auth.login)

// CREATE A USER
router.post("/register", auth.register);

// RESET PASSWORD REQUEST
router.post("/resetPasswordRequest", auth.resetPasswordRequest);

// RESET PASSWORD
router.post("/resetPassword", auth.resetPassword);

module.exports = router