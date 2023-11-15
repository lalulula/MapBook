const mongoose = require("mongoose");

const MapReplySchema = new mongoose.Schema(
  {
    map_reply_content: {
      type: String,
      required: true,
      max: 50,
    },
    map_reply_owner: {
      type: ObjectId,
      required: true,
    },
    map_comment_id: {
      type: ObjectId,
      required: true,
    },
  },
);
const MapReply = mongoose.model("MapReply", MapReplySchema);
module.exports = MapReply