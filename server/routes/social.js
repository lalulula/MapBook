const express = require("express");
const social = require("../controllers/social.js");

const router = express.Router();

// Get all social post
router.get("/socialPosts", social.getAllPost);

// Get social post with postid
router.get("/socialPost/:sPostId", social.getPostDetails);

// Get social post id
router.get("/mySocialPost/:userId", social.getMySocialPosts);

// Create Post
router.post("/createSocialPost", social.createPost);

// UpdatePost
router.put("/editSocialPost/:sPostId", social.editPost);

// Delete Post
router.delete("/deleteSocialPost/:sPostId", social.deletePost);

module.exports = router;
