const mongoose = require("mongoose");

const SocialPostReplySchema = new mongoose.Schema({
  social_reply_content: {
    type: String,
    required: true,
    max: 50,
  },
  social_reply_owner: {
    type: ObjectId,
    required: true,
  },
  social_comment_id: {
    type: ObjectId,
    required: true,
  },
});
const SocialPostReply = mongoose.model(
  "SocialPostReply",
  SocialPostReplySchema
);
module.exports = SocialPostReply;
