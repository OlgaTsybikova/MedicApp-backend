const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const corsOptions = require("../utils/corsOptions");
const { notFoundError, generalError } = require("./middlewares/errors/errors");

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use(notFoundError);
app.use(generalError);

module.exports = app;
