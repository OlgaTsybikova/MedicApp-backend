require("dotenv").config();
const mongoose = require("mongoose");
const debug = require("debug");
const chalk = require("chalk");

const connectDB = (connectionString) =>
  new Promise((resolve, reject) => {
    mongoose.connect(connectionString, (error) => {
      if (error) {
        reject(error);
        return;
      }
      debug(chalk.bold.bgMagenta.greenBright(`Database is connected`));
      resolve();
    });
  });

module.exports = connectDB;
