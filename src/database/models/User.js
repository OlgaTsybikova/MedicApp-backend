const { Schema, model, default: mongoose, SchemaTypes } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  medicationsFavoritos: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "medications" },
      treatment: { type: Boolean, default: [] },
    },
  ],
  ownMedications: [
    { type: SchemaTypes.ObjectId, ref: "medications", default: [] },
  ],
});

const User = model("User", UserSchema, "users");

module.exports = User;
