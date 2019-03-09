const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    index: {
      unique: true,
      dropDups: true,
    },
  },
});

module.exports = topicSchema;
