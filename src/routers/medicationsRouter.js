const express = require("express");
const {
  getMedications,
  deleteMedications,
} = require("../controllers/medicationsControllers");

const medicationsRouter = express.Router();

medicationsRouter.get("/list", getMedications);
medicationsRouter.delete("/:id", deleteMedications);

module.exports = medicationsRouter;
