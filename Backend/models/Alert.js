const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  location: String,

  status: {
    type: String,
    enum: ["pending", "accepted", "completed"],
    default: "pending"
  },

  responderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Alert", alertSchema);