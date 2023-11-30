const mongoose = require("mongoose");

const ResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800,// this is the expiry time in seconds (30mins)
  },
});

module.exports = mongoose.model("ResetToken", ResetTokenSchema);