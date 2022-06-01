require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../database/models/User");

const userRegister = async (req, res, next) => {
  const { name, username, password } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    const error = new Error();
    error.statusCode = 409;
    error.message = "This user already exists...";

    next(error);
  }
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, username, password: encryptedPassword };

    await User.create(newUser);

    res.status(201).json({ username });
  } catch (error) {
    error.statusCode = 400;
    error.message = "Wrong user data..";
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    const error = new Error("There is no user with this name...");
    error.statusCode = 403;

    next(error);
  } else {
    const matchingPassword = bcrypt.compare(password, user.password);

    const userData = {
      username: user.username,
      password: user.password,
      id: user.id,
    };

    if (!matchingPassword) {
      const error = new Error("Password is wrong...Please, try again...");
      error.code = 403;
      error.customError = "Oops, can't let you in with theis info...";
      next(error);
    } else {
      const token = jwt.sign(userData, process.env.JWT_SECRET);
      res.status(200).json(token);
    }
  }
};

module.exports = {
  userRegister,
  userLogin,
};
