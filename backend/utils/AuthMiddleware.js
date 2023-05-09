const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

module.exports = async (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  } else {
    console.error("No token found!");
    return res.status(403).json({ error: "Unauthorized!" });
  }

  try {
    const decoded = jwt.verify(idToken, process.env.SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Access denied. User not found." });
    }

    req.user = user;

    next();
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ message: "Invalid token." });
  }
};
