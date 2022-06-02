const bcrypt = require("bcrypt");
const { userRegister, userLogin } = require("./userControllers");
const User = require("../database/models/User");

const mockNewUser = {
  name: "Manu",
  username: "manu",
  password: "11111",
  _id: "sdjdksfwe54",
};

jest.mock("../database/models/User", () => ({
  findOne: jest.fn().mockResolvedValue(true),
  create: jest.fn(() => mockNewUser),
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn(),
}));

const expectedToken = "expectedtokenwow";

jest.mock("jsonwebtoken", () => ({
  sign: () => expectedToken,
}));

describe("Given a register user function", () => {
  describe("When it is called on", () => {
    test("Then it should call the response method with a status 201 and the name created user", async () => {
      const req = {
        body: { name: "Silvi", username: "silvi", password: "11111" },
      };

      User.findOne.mockImplementation(() => false);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedStatus = 201;
      const expectedJson = { username: "silvi" };
      bcrypt.hash.mockImplementation(() => "hashedPassword");
      await userRegister(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });
  describe("When it is called with a user that is already in the database", () => {
    test("Then it should call the 'next' middleware with an error", async () => {
      const req = {
        body: { name: "Paco", username: "paco", password: "paco1" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockNext = jest.fn();
      User.findOne.mockImplementation(() => true);
      bcrypt.hash.mockImplementation(() => "hashedPassword");

      await userRegister(req, res, mockNext);
      const expectedError = new Error();
      expectedError.code = 409;
      expectedError.message = "This user already exists...";

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a userLogin function", () => {
  const req = {
    body: {
      username: "username",
      pasword: "userpassword",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When invoked with a request object with a correct username and password", () => {
    test("Then it should call the response status method with 200", async () => {
      await userLogin(req, res);
      const expectedStatus = 200;
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token: expectedToken });
    });
    describe("When invoked with a req object with an incorrect urername", () => {
      test("Then it should call the next function", async () => {
        const next = jest.fn();

        User.findOne = jest.fn().mockResolvedValue(false);

        await userLogin(req, res, next);

        expect(next).toHaveBeenCalled();
      });
    });
  });
});
