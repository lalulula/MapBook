const express = require("express");
const mapReply = require("../controllers/mapReply.js");

const router = express.Router();

// Get all map post Replies of comment ID
router.get("/mapReplies/:sCommentId", mapReply.getAllMapPostReplies);

router.get("/existingMapReplies", mapReply.getAllExistingMapPostReplies);


// Get map Reply with Reply ID
router.get("/:sReplyId", mapReply.getMapPostReply);

// Create Reply
router.post("/createMapReply", mapReply.createMapPostReply);

// Update Reply
router.put("/editMapReply/:sReplyId", mapReply.editMapPostReply);

// Delete reply
router.delete("/deleteMapReply/:sReplyId", mapReply.deleteMapPostReply);

module.exports = router;