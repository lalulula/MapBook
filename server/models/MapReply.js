const mongoose = require("mongoose");

const MapReplieschema = new mongoose.Schema(
  {
    map_reply_content: {
      type: String,
      required: true,
      max: 50,
    },
    map_reply_owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    map_comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
);
const MapReply = mongoose.model("MapReply", MapReplieschema);
module.exports = MapReply