require("dotenv").config();
const debug = require("debug")(
  "medications:controllers:medicationsControllers"
);
const chalk = require("chalk");
const Medication = require("../database/models/Medication");
const User = require("../database/models/User");

const getMedications = async (req, res, next) => {
  try {
    const page = +(req.query?.page || 0);
    let medicationsPerPage = +(req.query?.medicationsPerPage || 5);
    if (medicationsPerPage > 5) {
      medicationsPerPage = 5;
    }

    let queryNextPrev = "";
    const filter = {};

    if (req.query?.category) {
      debug(
        chalk(
          `Get medications by Category: ${req.query?.category} request received`
        )
      );

      filter.categories = req.query.category;
      queryNextPrev += `category=${req.query.category}`;
    }
    if (req.query?.title) {
      debug(
        chalk(`Get medications by Title: ${req.query?.title} request received`)
      );

      filter.titles = req.query.title;
      queryNextPrev += `title=${req.query.title}`;
    }

    if (req.query?.user) {
      debug(chalk(`Get medications by user request received`));
      filter.owner = req.userId;
      queryNextPrev += `user=${req.query.user}`;
    }

    const medications = await Medication.find(filter)
      .sort({ _id: -1 })
      .limit(medicationsPerPage)
      .skip(page * medicationsPerPage);

    const total = await Medication.count(filter);

    const medicationsList = medications.map(
      ({
        _id: id,
        title,
        image,
        defaultImage,
        category,
        prospect,
        description,
        uses,
        dosis,
        owner,
        treatment,
      }) => ({
        id,
        title,
        image,
        defaultImage,
        category,
        prospect,
        description,
        uses,
        dosis,
        owner,
        treatment,
      })
    );

    const domainUrl =
      "https://olga-tsybikova-back-final-project-202204.onrender.com/";

    let nextPage = `${domainUrl}medications?page=${
      page + 1
    }&pageSize=${medicationsPerPage}&${queryNextPrev}`;

    if (page >= Math.trunc(total / medicationsPerPage)) {
      nextPage = undefined;
    }

    let previousPage;
    if (page > 0) {
      previousPage = `${domainUrl}medications?page=${
        page - 1
      }&pageSize=${medicationsPerPage}&${queryNextPrev}`;
    }

    const response = {
      page,
      medicationsPerPage,
      nextPage,
      previousPage,
      total,
      results: medicationsList,
    };

    res.status(200).json(response);
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
    const { userId } = req;
    const { defaultImage, file } = req;

    const newMedication = {
      title: req.body.title,
      category: req.body.category,
      image: req.body.image,
      uses: req.body.uses,
      treatment: req.body.treatment,
      defaultImage: file ? defaultImage : "",
      date: new Date(),
    };

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

const updateMedication = async (req, res, next) => {
  const { id } = req.params;
  const { defaultImage, file } = req;

  const newMedication = {
    title: req.body.title,
    category: req.body.category,
    image: req.body.image,
    uses: req.body.uses,
    treatment: req.body.treatment,
    defaultImage: file ? defaultImage : "",
  };

  await Medication.findByIdAndUpdate(id, newMedication)
    .then(() => {
      res.status(200).json({
        updatedMedication: newMedication,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
      next(error);
    });
};

const getMedicationById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const medicationDetails = await Medication.findById(id).populate(
      "owner",
      "username",
      User
    );
    res.status(200).json({ medicationDetails });
  } catch (error) {
    res.status(400).json({
      error,
    });
    next(error);
  }
};

module.exports = {
  getMedications,
  deleteMedications,
  createMedication,
  updateMedication,
  getMedicationById,
};
