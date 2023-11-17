const express = require("express");
const discussion = require("../controllers/discussion.js")

const router = express.Router();

// Get all discussion post
router.get("/discussionPosts", discussion.login)

// Get discussion post id
router.get("/discussionPost/:sPostId", discussion.register);

// Create Post
router.post("/createDiscussionlPost", discussion.editUser);

// UpdatePost
router.put("/updateDiscussionPost/:sPostId", discussion.getUser)

// Delete Post
router.delete("/deleteDiscussionPost/:sPostId", discussion.editUser);



module.exports = router