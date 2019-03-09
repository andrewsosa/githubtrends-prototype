const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = eventSchema;
