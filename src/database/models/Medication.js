const { Schema, default: mongoose, model } = require("mongoose");

const medicationSchema = new Schema({
  title: String,
  image: String,
  category: [{ id: { type: mongoose.Schema.Types.ObjectId } }],
  prospect: String,
  description: String,
  uses: String,
  dosis: String,
  treatment: String,
});
const Medication = model("Medication", medicationSchema, "medications");

export default Medication;
