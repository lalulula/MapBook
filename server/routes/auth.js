const express = require("express");
const auth = require("../controllers/auth.js")

const router = express.Router();

// CREATE A USER
router.post("/register", auth.register);

// UPDATE A USER
router.put("/user", auth.editUser);

module.exports = router