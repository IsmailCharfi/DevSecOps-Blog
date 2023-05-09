const app = require("express");
const auth = require("../../../backend/utils/authMiddleware");
const {
  signup,
  login,
  addUserDetails,
  getAuthenticatedUserDetails,
  getUserDetails,
  markNotificationRead,
  uploadImage,
} = require("./users.controllers");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

const Router = app.Router();

// auth routes
Router.post("/signup", signup).post("/login", login);

Router.post("/upload", auth, upload.single("image"), uploadImage);

// current logged in user details
Router.route("/")
  .post(auth, addUserDetails)
  .get(auth, getAuthenticatedUserDetails);

Router.get("/:id", getUserDetails);

Router.post("/notification", markNotificationRead);

module.exports = Router;
