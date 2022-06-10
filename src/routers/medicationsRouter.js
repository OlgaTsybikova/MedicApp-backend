const express = require("express");
const multer = require("multer");

const {
  getMedications,
  deleteMedications,
  createMedication,
  updateMedication,
} = require("../controllers/medicationsControllers");

const upload = multer({ dest: "images/" });
const medicationsRouter = express.Router();

medicationsRouter.get("/list", getMedications);
medicationsRouter.delete("/:id", deleteMedications);
medicationsRouter.post("/create", upload.single("image"), createMedication);
medicationsRouter.put("/update/:id", upload.single("image"), updateMedication);
module.exports = medicationsRouter;
