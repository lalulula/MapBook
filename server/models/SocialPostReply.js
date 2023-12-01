const mongoose = require("mongoose");

const SocialPostReplieschema = new mongoose.Schema({
  social_reply_content: {
    type: String,
    required: true,
    max: 50,
  },
  social_reply_owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  social_comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
const SocialPostReply = mongoose.model(
  "SocialPostReply",
  SocialPostReplieschema
);
module.exports = SocialPostReply;
