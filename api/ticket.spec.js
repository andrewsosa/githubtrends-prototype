/* eslint-env jest */

const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app } = require("../app");

const ticketRoute = "/api/tickets";
const cleanDB = done => mongoose.connection.db.dropDatabase(done);
const body = schema => res => expect(res.body).toMatchObject(schema);

let mongod;
beforeAll(async () => {
  mongod = new MongoMemoryServer();
  process.env.MONGO_URI = await mongod.getConnectionString();
});

afterAll(async () => {
  mongod.stop();
});
