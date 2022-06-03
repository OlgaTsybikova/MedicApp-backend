require("dotenv").config();
const debug = require("debug")("medications:server:middlewares:auth");
const chalk = require("chalk");

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization.includes("Bearer ")) {
      debug(chalk.redBright("Authorization does not include a token bearer"));
      throw new Error();
    }

    const token = authorization.replace("Bearer ", "");
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    debug(chalk.green("Received a valid token"));
    req.userId = id;

    next();
  } catch {
    debug(chalk.red("Invalid token"));
    const customError = new Error("Invalid token");
    customError.statusCode = 401;

    next(customError);
  }
};

module.exports = auth;
