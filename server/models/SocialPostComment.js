const mongoose = require("mongoose");

const SocialPostCommentSchema = new mongoose.Schema({
  social_comment_content: {
    type: String,
    required: true,
    max: 50,
  },
  social_comment_owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  social_post_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
const SocialPostComment = mongoose.model(
  "SocialPostComment",
  SocialPostCommentSchema
);
module.exports = SocialPostComment;
