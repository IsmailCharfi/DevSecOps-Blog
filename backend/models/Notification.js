const mongoose = require("mongoose");
const PostModel = require("./Post");
const { Schema, model } = mongoose;

const NotificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User" },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    type: String,
    read: Boolean,
  },
  {
    timestamps: true,
  }
);

const NotificationModel = model("Notification", NotificationSchema);

module.exports = NotificationModel;
