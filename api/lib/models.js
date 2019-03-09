/* eslint-disable global-require */
const mongoose = require("mongoose");
const { ModelNames } = require("./common");

const models = {
  Event: mongoose.model(ModelNames.Event, require("./schema/event")),
  Ticket: mongoose.model(ModelNames.Ticket, require("./schema/ticket")),
  Topic: mongoose.model(ModelNames.Topic, require("./schema/topic")),
  User: mongoose.model(ModelNames.User, require("./schema/user")),
};

module.exports = models;
