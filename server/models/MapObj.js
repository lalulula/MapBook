const mongoose = require("mongoose");

const MapObjSchema = new mongoose.Schema({
  map_name: {
    type: String,
    required: true,
    max: 50,
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
    default:
      "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson",
  },
  is_visible: {
    type: Boolean,
    default: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  map_description: {
    type: String,
    required: true,
  },
  mapPreviewImg: {
    type: String,
    // you can change default image
    default: "https://i.stack.imgur.com/fdKJ3.png",
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
  view_count: {
    type: Number,
    default: 0,
  },
});
const MapObj = mongoose.model("MapObj", MapObjSchema);
module.exports = MapObj;
