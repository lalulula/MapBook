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
    type: [String],
  },
  topic: { type: String },
  customTopic: { type: String },
  post_owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  view_count: {
    type: Number,
    default: 0,
  },
  social_users_liked: {
    // type: Map,
    // of: Boolean,
    type: [mongoose.Schema.Types.ObjectId],
  },
  social_comments: {
    // type: Map,
    // of: Boolean,
    type: [mongoose.Schema.Types.ObjectId],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
const SocialPost = mongoose.model("SocialPost", SocialPostSchema);
module.exports = SocialPost;
