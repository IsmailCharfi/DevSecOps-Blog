const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const LikeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  {
    timestamps: true,
  }
);

const LikeModel = model("Like", LikeSchema);

module.exports = LikeModel;
