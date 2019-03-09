const mongoose = require("mongoose");
const { TicketStatus, ModelNames } = require("../common");

const { Schema } = mongoose;

const ticketSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.User,
    required: false,
  },
  name: {
    type: String,
    required: false,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: [true, "Location field is required."],
  },
  status: {
    type: String,
    default: TicketStatus.open,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.Event,
    required: [true, "Event field is required."],
  },
  topics: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelNames.Topic,
      },
    ],
    default: [],
  },
});

module.exports = ticketSchema;
