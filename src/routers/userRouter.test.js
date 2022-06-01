const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const connectDB = require("../database");
const User = require("../database/models/User");
const mockNewUser = require("../mocks/usersMock");
const app = require("../server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});
beforeEach(async () => {
  await User.create(mockNewUser[0]);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a POST/user/register/ endpoint", () => {
  describe("When it receives a request with a new user", () => {
    test("Then it should respond with the status code 201 and the registered user", async () => {
      const newUser = {
        name: "luis",
        username: "luisito",
        password: "luisito",
      };
      await request(app).post("/user/register").send(newUser).expect(201);
    });
  });
});

describe("Given a POST/user/login endpoint", () => {
  describe("When it receives a request with an existing user", () => {
    test("Then it should respond with the status code 200 and a token", async () => {
      const user = {
        username: "admin",
        password: "admin",
      };

      const {
        body: { token },
      } = await request(app).post("/user/login").send(user).expect(200);
      expect(token).not.toBeNull();
    });
  });
});
