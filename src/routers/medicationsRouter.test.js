require("dotenv").config();
const { verify } = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const connectDB = require("../database");
const Medication = require("../database/models/Medication");
const mockmeds = require("../mocks/mockmeds");
const mockPaginatedMedications = require("../mocks/mockPaginatedMedications");
const app = require("../server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});
beforeEach(async () => {
  await Medication.create(mockmeds[0]);
});

afterEach(async () => {
  await Medication.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: jest.fn(),
}));

describe("Given a GET/medication/list endpoint", () => {
  describe("When its been called with a request", () => {
    test("Then it should respond with the status 200 and the list of medications", async () => {
      verify.mockImplementation(() => "anymockvalue");

      await Medication.findOne({
        title: mockPaginatedMedications.results[0].title,
      });

      const expectedBody = {
        page: 0,
        medicationsPerPage: 5,
        total: 1,
        results: [
          {
            id: "6299c35a0a3e1e0a9b455358",
            title: "Ibuprofen",
            image:
              "https://i5.walmartimages.com/asr/3c370c78-10d7-4e8a-b088-a788e2fecb32.6841b35931ae43aea935a59106381325.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
            category: "Head",
            prospect: "https://go.drugbank.com/drugs/DB01050",
            description:
              "Take one tablet every four hours to six hours when you need relief from minor pain of arthritis, headache, muscle pain, toothache, backache, and menstrual pain. You can take it when you are sick to bring down your fever and keep aches and pains away. This bottle contains 300 softgels at 200 milligrams of Ibuprofen in each capsule. ",
            uses: "Active Ingredient: Ibuprofen 200 mg, For ages 12 years or over",
            dosis: "1 pill every 8 hours up to 7 days",
            owner: "6294fb700a3e1e0a9b455331",
            treatment: "false",
          },
        ],
      };

      const { body } = await request(app)
        .get("/medications")
        .set({ authorization: "Bearer mocktoken" })
        .expect(200);

      expect(body).toEqual(expectedBody);
    });
  });
});
