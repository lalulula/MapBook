const express = require("express");
const map = require("../controllers/map.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

//GET ALL MAPS
router.get("/getAllMaps", map.getAllMaps);

// GET ALL MAPS CREATED BY A USER
router.get("/getMaps/:userId", /* auth.verifyToken, */ map.getMaps);

// GET A MAP BY A MAP ID
router.get("/getMap/:mapId", map.getMap);

// // CREATE A MAP
router.post("/createMap", auth.verifyToken, map.createMap);

// REMOVE A MAP & FILE FROM FIREBASE
router.delete("/:id", auth.verifyToken, map.removeMap);

// like and dislike map
router.put("/likeMap/:sMapId", map.likeMap);

module.exports = router;
