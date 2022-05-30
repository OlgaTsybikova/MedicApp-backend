require("dotenv").config();
const debug = require("debug")("medications:root");
const chalk = require("chalk");
const connectDB = require("./database");
const startServer = require("./server/startServer");

const port = process.env.SERVER_PORT ?? 4005;

const mongoString = process.env.MONGODB_STRING;

(async () => {
  try {
    await connectDB(mongoString);
    await startServer(port);
  } catch (error) {
    debug(chalk.red("Exiting with error"));
    process.exit(1);
  }
})();
