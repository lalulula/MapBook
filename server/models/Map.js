const mongoose = require("mongoose");

const MapSchema = new mongoose.Schema(
  {
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
      enum: ['heat', 'thematic', 'circle', 'pie', 'bar'],
      required: true,
    },
    colors: {
      type: Array,
      required: true,
    },
    data_names: {
      type: Array,
      required: true,
    },
    data_values: {
      type: Map,
      required: true,
    },
    heat_range: {
      type: Array,
      default: [0, 0, 0, 0]
    },
    map_users_liked: {
      tpye: Map,
      of: Boolean,
      default: {},
    }
  },
);
const Map = mongoose.model("Map", MapSchema);
module.exports = Map