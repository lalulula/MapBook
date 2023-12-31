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

// Edit A MAP BY A MAP ID
router.put("/editMap/:mapId", map.editMap);

// REMOVE A MAP BY A MAP ID
router.delete("/removeMap/:mapId", map.removeMap);

// // CREATE A MAP
router.post("/createMap", map.createMap);

// REMOVE A MAP & FILE FROM FIREBASE
router.delete("/:mapId", map.removeMap);

// like and dislike map
router.put("/likeMap/:sMapId", auth.verifyToken, map.likeMap);

module.exports = router;
