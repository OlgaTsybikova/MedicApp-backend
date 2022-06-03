const jwt = require("jsonwebtoken");
const auth = require("./auth");

describe("Given an auth function", () => {
  describe("When it receives a request with a valid token", () => {
    test("Then it should call next ", () => {
      const mockId = { id: 3 };
      jwt.verify = jest.fn().mockReturnValue(mockId);
      const next = jest.fn();

      const req = {
        headers: { authorization: "Bearer " },
      };

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("When it receives a request with nvalid token", () => {
    test("Then it should call next with error", () => {
      const req = {
        headers: { Authorization: "InvalidToken" },
      };
      const next = jest.fn();
      const customError = new Error("Invalid token");
      customError.statusCode = 401;

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
