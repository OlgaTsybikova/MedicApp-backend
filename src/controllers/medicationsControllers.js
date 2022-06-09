require("dotenv").config();
const debug = require("debug")(
  "medications:controllers:medicationsControllers"
);
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const Medication = require("../database/models/Medication");
const User = require("../database/models/User");

const getMedications = async (req, res, next) => {
  try {
    const medications = await Medication.find();
    res.status(200).json(medications);
    debug("Medications collection request received");
  } catch (error) {
    error.StatusCode = 404;
    error.customMessage = "Not found";
    next(error);
  }
};
const deleteMedications = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deleteMedication = await Medication.findByIdAndDelete(id);
    if (deleteMedication) {
      res.status(200).json({ message: "Medication deleted correctly!" });
    }
    debug("Received a request to delete a Medication");
  } catch (error) {
    error.StatusCode = 404;
    next(error);
  }
};

const createMedication = async (req, res, next) => {
  try {
    const newMedication = req.body;
    const { userId } = req;
    const { file } = req;

    if (file) {
      const newFileTitle = `${Date.now()}-${file.originalname}`;

      fs.rename(
        path.join("images", file.filename),
        path.join("images", newFileTitle),
        (error) => {
          if (error) {
            debug(chalk.red("Error trying to rename image of project"));
            next(error);
          }
        }
      );
      newMedication.image = newFileTitle;
    }

    const createdMedication = await Medication.create(newMedication);
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { createdmedications: createMedication.id } }
    );
    res.status(201).json({ medication: createdMedication });
    debug(chalk.green("Medication has been created correctly"));
  } catch (error) {
    error.customMessage = "Could not create the medication";
    error.statusCode = 400;
    debug(chalk.red("Error creating medication"));

    next(error);
  }
};

module.exports = { getMedications, deleteMedications, createMedication };
