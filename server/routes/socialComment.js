const express = require("express");
const socialComment = require("../controllers/socialComment.js");

const router = express.Router();

// Get all social post comments of postID
router.get("/socialComments/:sPostId", socialComment.getAllSocialComments);

// Get social comment with comment ID
router.get("/socialComment/:sCommentId", socialComment.getSocialComment);

// Create comment
router.post("/createSocialComment", socialComment.createSocialComment);

// Update comment
router.put("/editSocialComment/:sCommentId", socialComment.editSocialComment);

// Delete comment
router.delete("/deleteSocialComment/:sCommentId", socialComment.deleteSocialComment);



module.exports = router;
