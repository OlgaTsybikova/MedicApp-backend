const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const corsOptions = require("../utils/corsOptions");
const { notFoundError, generalError } = require("./middlewares/errors/errors");
const userRouter = require("../routers/userRouter");
const medicationsRouter = require("../routers/medicationsRouter");
const auth = require("./middlewares/auth/auth");

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/user", userRouter);
app.use("/medications", auth, medicationsRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
