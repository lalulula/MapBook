const express = require("express");
const mapReply = require("../controllers/mapReply.js");

const router = express.Router();

// Get all map post Replys of comment ID
router.get("/mapReplys/:sCommentId", mapReply.getAllMapPostReplys);

router.get("/existingMapReplys", mapReply.getAllExistingMapPostReplys);


// Get map Reply with Reply ID
router.get("/:sReplyId", mapReply.getMapPostReply);

// Create Reply
router.post("/createMapReply", mapReply.createMapPostReply);

// Update Reply
router.put("/editMapReply/:sReplyId", mapReply.editMapPostReply);

// Delete reply
router.delete("/deleteMapReply/:sReplyId", mapReply.deleteMapPostReply);

module.exports = router;