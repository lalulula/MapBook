const mongoose = require("mongoose");

const MapObjSchema = new mongoose.Schema({
  map_name: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  topic: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  file_path: {
    type: String,
    // required: true,
  },
  is_visible: {
    type: Boolean,
    default: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  map_users_liked: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  map_comments: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },

});
const MapObj = mongoose.model("MapObj", MapObjSchema);
module.exports = MapObj;
