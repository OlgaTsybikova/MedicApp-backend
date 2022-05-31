const express = require("express");
const { userRegister } = require("../controllers/userControllers");

const userRouter = express.Router();

userRouter.post("/register", userRegister);

module.exports = userRouter;
