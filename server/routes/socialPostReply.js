const express = require("express");
const socialPostReply = require("../controllers/socialPostReply.js");

const router = express.Router();

// Get all social post Replys of postID
//router.get("/socialComments/:sPostId", socialComment.getAllSocialComments);
router.get("/socialComments/:sCommentId", socialPostReply.getAllSocialPostReplys);

router.get("/existingSocialPostReplys", socialPostReply.getAllExistingSocialPostReplys);


// Get social Reply with Reply ID
router.get("/:sPostReplyId", socialPostReply.getSocialPostReply);

// Create Reply
router.post("/createSocialPostReply", socialPostReply.createSocialPostReply);

// Update Reply
router.put("/editSocialPostReply/:sCommentReplyId", socialPostReply.editSocialPostReply);

// Delete reply
router.delete("/deleteSocialPostReply/:sCommentReplyId", socialPostReply.deleteSocialPostReply);

module.exports = router;