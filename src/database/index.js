require("dotenv").config();
const mongoose = require("mongoose");
const debug = require("debug")("medications:database");
const chalk = require("chalk");

const connectDB = (connectionString) =>
  new Promise((resolve, reject) => {
    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        const newReturnedJSON = { ...ret };
        // eslint-disable-next-line no-underscore-dangle
        delete newReturnedJSON._id;
        // eslint-disable-next-line no-underscore-dangle
        delete newReturnedJSON.__v;
        return newReturnedJSON;
      },
    });
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
