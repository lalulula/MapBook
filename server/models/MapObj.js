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
  template: {
    type: String,
    enum: ["heat", "thematic", "circle", "pie", "bar"],
    required: true,
  },
  colors: {
    type: String,
    required: true,
  },
  data_names: {
    type: Array,
    // required: true,
  },
  data_values: {
    type: Map,
    of: Number,
    // required: true,
  },
  heat_range: {
    type: Array,
    default: [0, 0, 0, 0, 0],
  },
  map_users_liked: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  map_comments: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },

});
const MapObj = mongoose.model("MapObj", MapObjSchema);
module.exports = MapObj;
