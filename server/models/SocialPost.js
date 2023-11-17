const mongoose = require("mongoose");

const SocialPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  post_content: {
    type: String,
    required: true,
  },
  post_images: {
    type: String,
  },
  post_owner: {
    type: ObjectId,
    required: true,
  },
  view_count: {
    type: Number,
    default: 0,
  },
  social_users_liked: {
    type: Map,
    of: Boolean,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
const SocialPost = mongoose.model("SocialPost", SocialPostSchema);
module.exports = SocialPost;
