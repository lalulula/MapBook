const express = require("express");
const users = require("../controllers/users.js");
const auth = require("../middleware/auth.js")

const router = express.Router();

// GET A CURRENT LOGGED IN USER
router.get("/:id", auth.verifyToken, users.getCurrentUser);

// UPDATE A USER
router.put("/:id", auth.verifyToken, users.editUser);

module.exports = router