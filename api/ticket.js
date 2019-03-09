const mongoose = require("mongoose");
const { router, get } = require("microrouter");
const { send } = require("micro");

// const Ticket = mongoose.model("Ticket", require("./lib/schema/ticket"));

module.exports = router(
  get("/api/ticket", (req, res) => send(res, 200, "All tickets!")),
  get("/api/ticket/butts", (req, res) => send(res, 200, "Butts")),
  get("/api/ticket/:id", (req, res) =>
    send(res, 200, `Ticket number ${req.params.id}`),
  ),
);
