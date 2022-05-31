const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const connectDB = require("../database");
const app = require("../server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});
describe("Given a POST/user/register/ endpoint", () => {
  describe("When it receives a request with a new user", () => {
    test("Then it should respond with the status code 201 and the registered user", async () => {
      const newUser = { username: "luisito", password: "luisito" };
      await request(app).post("/user/register").send(newUser).expect(201);
    });
  });
});
