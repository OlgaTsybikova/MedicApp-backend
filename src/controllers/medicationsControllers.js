require("dotenv").config();
const debug = require("debug")(
  "medications:controllers:medicationsControllers"
);
const Medication = require("../database/models/Medication");

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
module.exports = getMedications;
