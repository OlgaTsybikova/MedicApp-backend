const express = require("express");
const multer = require("multer");

const {
  getMedications,
  deleteMedications,
  createMedication,
} = require("../controllers/medicationsControllers");

const upload = multer({ dest: "images/" });
const medicationsRouter = express.Router();

medicationsRouter.get("/list", getMedications);
medicationsRouter.delete("/:id", deleteMedications);
medicationsRouter.post("/create", upload.single("image"), createMedication);
module.exports = medicationsRouter;
