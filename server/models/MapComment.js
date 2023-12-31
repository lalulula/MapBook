const mongoose = require("mongoose");

const MapCommentSchema = new mongoose.Schema(
  {
    map_comment_content: {
      type: String,
      required: true,
      max: 50,
    },
    map_comment_owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    map_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
);
const MapComment = mongoose.model("MapComment", MapCommentSchema);
module.exports = MapComment