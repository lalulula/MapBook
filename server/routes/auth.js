const express = require("express");
const auth = require("../controllers/auth.js")

const router = express.Router();

// LOGIN
router.post("/login", auth.login)

// CREATE A USER
router.post("/register", auth.register);

// GET A CURRENT LOGGED IN USER
router.get("/user/:id", auth.getUser)

// UPDATE A USER
router.put("/user", auth.editUser);

module.exports = router