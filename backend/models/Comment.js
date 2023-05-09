const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CommentSchema = new Schema(
  {
    body: String,
    imageUrl: String,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  {
    timestamps: true,
  }
);

const CommentModel = model("Comment", CommentSchema);

module.exports = CommentModel;
