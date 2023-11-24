const express = require("express");
const users = require("../controllers/users.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

// GET A CURRENT LOGGED IN USER
router.get("/:id", auth.verifyToken, users.getCurrentUser);


// GET All UserInfo
router.get("/getAllUsers/:id", users.getAllUsers);

// GET UserInfo by Id
router.get("/getUser/:id", users.getUserById);



// REMOVE USER
router.delete("/:id", auth.verifyToken, users.removeUser);

module.exports = router;
