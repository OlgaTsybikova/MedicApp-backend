const { Joi } = require("express-validation");

const credentialsRegisterSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    username: Joi.string()
      .required()
      .messages({ message: "Username is required" }),
    password: Joi.string()
      .max(15)
      .required()
      .messages({ message: "Password is required" }),
  }),
};

module.exports = { credentialsRegisterSchema };
