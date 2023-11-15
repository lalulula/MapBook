const mongoose = require("mongoose");

const DiscussionPostSchema = new mongoose.Schema(
  {
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
    discussion_users_liked: {
      type: Map,
      of: Boolean,
    },
  },
);
const DiscussionPost = mongoose.model("DiscussionPost", DiscussionPostSchema);
module.exports = DiscussionPost