const mongoose = require("mongoose");

const DiscussionPostReplySchema = new mongoose.Schema(
  {
    discussion_reply_content: {
      type: String,
      required: true,
      max: 50,
    },
    discussion_reply_owner: {
      type: ObjectId,
      required: true,
    },
    discussion_comment_id: {
      type: ObjectId,
      required: true,
    },
  },
);
const DiscussionPostReply = mongoose.model("DiscussionPostReply", DiscussionPostReplySchema);
module.exports = DiscussionPostReply