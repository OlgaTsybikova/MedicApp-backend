const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getMedications,
  deleteMedications,
  createMedication,
} = require("../controllers/medicationsControllers");

const upload = multer({ dest: path.join("uploads", "images") });
const medicationsRouter = express.Router();

medicationsRouter.get("/list", getMedications);
medicationsRouter.delete("/:id", deleteMedications);
medicationsRouter.post("/create", upload.single("image"), createMedication);
module.exports = medicationsRouter;
