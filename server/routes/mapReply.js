const express = require("express");
const mapReply = require("../controllers/mapReply.js");

const router = express.Router();

// Get all map post Replys of postID
//router.get("/mapComments/:sId", mapComment.getAllMapComments);
router.get("/mapReplys/:sCommentId", mapReply.getAllMapReplys);

router.get("/existingMapReplys", mapReply.getAllExistingMapReplys);


// Get map Reply with Reply ID
router.get("/:sReplyId", mapReply.getMapReply);

// Create Reply
router.post("/createMapReply", mapReply.createMapReply);

// Update Reply
router.put("/editMapReply/:sReplyId", mapReply.editMapReply);

// Delete reply
router.delete("/deleteMapReply/:sReplyId", mapReply.deleteMapReply);

module.exports = router;