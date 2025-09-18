const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  from: { type: String, required: true },   // username
  to:   { type: String, required: true },   // username
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false }
});

module.exports = mongoose.model("Message", MessageSchema);
