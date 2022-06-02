const Medication = require("../database/models/Medication");
const getMedications = require("./medicationsControllers");

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
