const mongoose = require("mongoose");

const DiscussionPostCommentSchema = new mongoose.Schema(
  {
    discussion_comment_content: {
      type: String,
      required: true,
      max: 50,
    },
    discussion_comment_owner: {
      type: ObjectId,
      required: true,
    },
    discussion_post_id: {
      type: ObjectId,
      required: true,
    },
  },
);
const DiscussionPostComment = mongoose.model("DiscussionPostComment", DiscussionPostCommentSchema);
module.exports = DiscussionPostComment