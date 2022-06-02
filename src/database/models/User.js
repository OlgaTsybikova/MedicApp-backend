const { Schema, model, default: mongoose } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  medications: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Medication" },
      treatment: { type: Boolean, default: false },
    },
  ],
});

const User = model("User", UserSchema, "users");

module.exports = User;
