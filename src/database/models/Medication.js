const { Schema, model, SchemaTypes } = require("mongoose");

const medicationSchema = new Schema({
  title: { type: String, required: true },
  image: String,
  defaultImage: String,
  category: String,
  prospect: String,
  description: String,
  uses: String,
  dosis: String,
  owner: { type: SchemaTypes.ObjectId, ref: "User" },
  treatment: { type: String },
  date: Date,
});

const Medication = model("Medication", medicationSchema, "medications");

module.exports = Medication;
