const {
  validateSignupData,
  cleanEditUserData,
} = require("../../../backend/utils/dataValidators");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../../models/User");
const LikeModel = require("../../models/Like");
const PostModel = require("../../models/Post");
const mongoose = require("mongoose");
const NotificationModel = require("../../models/Notification");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { valid, errors } = validateSignupData(req.body);

    if (!valid) return res.status(400).send(errors);

    const salt = bcrypt.genSaltSync(10);

    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
      imageUrl: `/public/uploads/avatar.webp`,
    };

    const existingUser = await UserModel.findOne({
      email: newUser.email,
      username: newUser.username,
    });

    if (existingUser) {
      return res.status(400).send({ email: "Email is already taken!" });
    } else {
      const user = await UserModel.create(newUser);
      const token = jwt.sign(
        { email: user.email, username: user.username, _id: user._id },
        process.env.SECRET
      );
      return res.status(201).send({ token });
    }
  } catch (err) {
    return res.status(500).send({ error: err.toString() });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ credential: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ credential: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, username: user.username, _id: user._id },
      process.env.SECRET
    );
    return res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    return res.status(404).send({ credential: "Incorrect credentials!" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const newUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { imageUrl: "/" + req.file.path },
      { new: true }
    );

    return res.status(200).send({ message: "Image uploaded successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.toString() });
  }
};

// add user profile data handler
exports.addUserDetails = async (req, res) => {
  const data = req.body;

  const userDetails = {
    bio: data.bio,
    website: data.website,
    location: data.location,
  };

  const cleanedData = cleanEditUserData(userDetails);

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      cleanedData,
      { new: true }
    );

    return res.status(200).send({ message: "Details added successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.toString() });
  }
};

exports.getAuthenticatedUserDetails = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }

    const likes = await LikeModel.find({ user: user._id })
      .populate("user")
      .populate("post");

    const notifications = await NotificationModel.find({
      recipient: user._id,
    })
      .populate("recipient")
      .populate("sender")
      .populate("post")
      .sort({ createdAt: "desc" })
      .limit(10);

    delete user._doc.password;

    const dataToSend = {
      ...user._doc,
      likes,
      notifications,
    };
    return res.status(200).send({ data: dataToSend });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.toString() });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }

    const posts = await PostModel.find({ user: user._id })
      .sort({
        createdAt: "desc",
      })
      .populate("user");

    delete user._doc.password;

    const dataToSend = {
      ...user._doc,
      posts,
    };

    return res.status(200).send({ data: dataToSend });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.toString() });
  }
};

exports.markNotificationRead = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    req.body.forEach(async (notificationId) => {
      const notification = await NotificationModel.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );
    });
    await session.commitTransaction();
    session.endSession();
    return res.status(200).send({ message: "Notifications marked read!" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    return res.status(500).send({ error: err.toString() });
  }
};
