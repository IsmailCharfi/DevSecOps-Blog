const express = require("express");
const app = express();
const cors = require("cors");
const postRoute = require("./resources/posts/posts.routes");
const userRoute = require("./resources/users/users.routes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/users", userRoute);
app.use("/posts", postRoute);

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DATABASE_URL)
  .catch(() => console.log("error connecting to the database"));

app.listen(process.env.PORT, () => {
  console.log(`listening to port ${process.env.PORT}`);
});
