const express = require("express");
const app = express();
const cors = require("cors");
const postRoute = require("./resources/posts/posts.routes");
const userRoute = require("./resources/users/users.routes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

app.use(cors());
app.use(bodyParser.json());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/users", userRoute);
app.use("/posts", postRoute);

mongoose.set("strictQuery", false);

mongoose
  .connect(
    "mongodb+srv://Ismail:plKgbbWaoqHSPawi@cluster0.rjsok.mongodb.net/?retryWrites=true&w=majority"
  )
  .catch(() => console.log("error connecting to the database"));

app.listen(4000, () => {
  console.log("listening to port 4000");
});
