const express = require("express");
const auth = require("../controllers/auth.js")

const router = express.Router();

router.post("/register", auth.register);

module.exports = router