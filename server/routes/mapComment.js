const express = require("express");
const mapComment = require("../controllers/mapComment.js");

const router = express.Router();

// Get all map post comments of postID
//router.get("/mapComments/:sPostId", mapComment.getAllMapComments);
router.get("/mapComments/:sPostId", mapComment.getAllMapComments);

router.get("/existingMapComments", mapComment.getAllExistingMapComments);


// Get map comment with comment ID
router.get("/:sCommentId", mapComment.getMapComment);

// Create comment
router.post("/createMapComment", mapComment.createMapComment);

// Update comment
router.put("/editMapComment/:sCommentId", mapComment.editMapComment);

// Delete comment
router.delete("/deleteMapComment/:sCommentId", mapComment.deleteMapComment);

module.exports = router;