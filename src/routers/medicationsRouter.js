const express = require("express");
const { getMedications } = require("../controllers/medicationsControllers");

const medicationsRouter = express.Router();

medicationsRouter.get("/list", getMedications);

module.exports = medicationsRouter;
