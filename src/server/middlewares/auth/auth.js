const debug = require("debug")("series:middlewares:auth");
const chalk = require("chalk");

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { Authorization } = req.headers;
  try {
    if (!Authorization.includes("Bearer ")) {
      debug(chalk.redBright("Authorization does not include a token bearer"));
      throw new Error();
    }

    const token = Authorization.replace("Bearer ", "");
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    debug(chalk.green("Received a valid token"));
    req.userId = id;

    next();
  } catch {
    debug(chalk.red("Invalid token"));
    const customError = new Error("invalid token");
    customError.statusCode = 401;

    next(customError);
  }
};

module.exports = auth;
