const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    password: { type: String, required: true },
    username: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    imageUrl: String,
    bio: String,
    website: String,
    Location: String,
  },
  { timestamps: true }
);

const UserModel = model("User", UserSchema);

module.exports = UserModel;
