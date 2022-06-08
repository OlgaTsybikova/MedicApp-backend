const Medication = require("../database/models/Medication");
const User = require("../database/models/User");
const mockmeds = require("../mocks/mockmeds");
const {
  getMedications,
  deleteMedications,
  createMedication,
} = require("./medicationsControllers");

describe("Given a getkindsList function", () => {
  describe("When it receives a request", () => {
    test("Then it should response with a method status 200 and a mockMedications", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const medicationsMock = [
        {
          id: 22,
          title: "Ibuprofen",
        },
      ];

      Medication.find = jest.fn().mockResolvedValue(medicationsMock);

      const expectedStatusCode = 200;

      await getMedications(null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(medicationsMock);
    });
  });
});

describe("Given a deleteMedication controller", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a method status and a confirmation of deletion 'Medication deleted correctly!'", async () => {
      const expectedJsonMessage = {
        message: "Medication deleted correctly!",
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(expectedJsonMessage),
      };
      const req = { params: { id: "629a0d040a3e1e0a9b455361" } };
      Medication.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue(expectedJsonMessage);
      await deleteMedications(req, res);

      const expectedStatus = 200;

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJsonMessage);
    });
  });
});

describe("Given createMedication function", () => {
  const next = jest.fn();

  describe("When it's invoqued with a request that has a new medication", () => {
    test("Then it should call the response's status method with 201 and the json method with the created medication", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const req = {
        body: { newMedication: mockmeds },
        file: {
          filename: "mockimagename",
          originalname: "mockimage.jpg",
        },
        userId: "mockid",
      };

      Medication.create = jest.fn().mockResolvedValueOnce(mockmeds);
      User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(true);

      await createMedication(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ medication: mockmeds });
    });
  });

  describe("When it's invoqued with a request that has a new project and a file but fails on renaming it's name", () => {
    test("Then it should call next", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.mock("fs", () => ({
        ...jest.requireActual("fs"),
        rename: jest.fn().mockRejectedValueOnce(new Error()),
      }));

      const req = {
        body: mockmeds[0],
        file: {},
        userId: "mockid",
      };

      await createMedication(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
