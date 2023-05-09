const PostModel = require("../../models/Post");
const CommentModel = require("../../models/Comment");
const LikeModel = require("../../models/Like");
const { EventEmitter } = require("events");
const NotificationModel = require("../../models/Notification");

const emitter = new EventEmitter();

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: "desc" })
      .populate("user");

    return res.status(200).send({ data: posts });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err.toString() });
  }
};

exports.createOnePost = async (req, res) => {
  try {
    const post = new PostModel({
      ...req.body,
      user: req.user._id,
      likeCount: 0,
      commentCount: 0,
    });

    await post.save();

    return res.status(201).send({ data: post });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err.toString() });
  }
};

// get one post
exports.getOnePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId).populate("user");

    if (!post) {
      return res.status(404).send({ error: "Post not found!" });
    }

    const comments = await CommentModel.find({ post: post._id })
      .sort({
        createdAt: "desc",
      })
      .populate("user");

    const dataToSend = {
      ...post._doc,
      comments,
    };

    return res.status(200).send({ data: dataToSend });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err.toString() });
  }
};

// update a post
exports.updateOnePost = async (req, res) => {
  try {
    const updatedPost = {
      title: req.body.title,
      bodyMeta: req.body.bodyMeta,
      body: req.body.body,
    };

    const post = await PostModel.findById(req.params.postId).populate("user");

    if (!post) {
      return res.status(404).send({ error: "Post not found!" });
    }

    if (!post.user._id.equals(req.user._id)) {
      return res.status(403).send({ error: "Unauthorized!" });
    } else {
      const newPost = await PostModel.findByIdAndUpdate(post._id, updatedPost);
      return res.status(200).send({ message: "Post updated successfully!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.toString() });
  }
};

// delete a post
exports.deleteOnePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);

    if (!post.user._id.equals(req.user._id)) {
      return res.status(403).send({ error: "Unauthorized!" });
    } else {
      const notifications = await NotificationModel.find({ post: post._id });
      const likes = await LikeModel.find({ post: post._id });
      const comments = await CommentModel.find({ post: post._id });

      notifications.map(async (notification) => await notification.remove());
      likes.map(async (like) => await like.remove());
      comments.map(async (comment) => await comment.remove());

      await post.remove();
      return res.status(200).send({ message: "Post deleted successfully!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.toString() });
  }
};

// comment on post
exports.commentOnPost = async (req, res) => {
  try {
    const commentData = {
      body: req.body.body,
      post: req.params.postId,
      user: req.user._id,
      createdAt: new Date().toISOString(),
    };

    const post = await PostModel.findById(req.params.postId).populate("user");

    if (!post) {
      return res.status(404).send({ error: "Post doesn't exist!" });
    }

    const comment = await CommentModel.create(commentData);

    const newPost = await PostModel.findByIdAndUpdate(req.params.postId, {
      commentCount: post.commentCount + 1,
    });

    await NotificationModel.create({
      read: false,
      post: post._id,
      recipient: post.user._id,
      sender: req.user._id,
      type: "comment",
    });

    return res.status(201).send({ data: comment._doc });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.toString() });
  }
};

// like a post
exports.likeAPost = async (req, res) => {
  try {
    const likeData = {
      user: req.user._id,
      post: req.params.postId,
    };

    const postDoc = await PostModel.findById(req.params.postId).populate(
      "user"
    );

    if (!postDoc) {
      return res.status(404).send({ error: "Post doesn't exist!" });
    }

    const like = await LikeModel.create(likeData);

    const newPost = await PostModel.findByIdAndUpdate(req.params.postId, {
      likeCount: postDoc.likeCount + 1,
    }).populate("user");

    const notification = await NotificationModel.create({
      post: newPost._id,
      sender: req.user._id,
      recipient: newPost.user._id,
      read: false,
      type: "like",
    });

    return res.status(200).send({ data: newPost._doc });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.toString() });
  }
};

// unlike a post
exports.unlikeAPost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId).populate("user");

    if (!post) {
      return res.status(404).send({ error: "Post doesn't exist!" });
    }

    const like = await LikeModel.findOne({
      user: req.user._id,
      post: req.params.postId,
    });

    if (!like) {
      return res.status(404).send({ error: "Like doesn't exist!" });
    }

    await NotificationModel.findOneAndDelete({
      type: "like",
      post: like.post._id,
      sender: req.user._id,
    });

    await like.remove();

    const newPost = await PostModel.findByIdAndUpdate(req.params.postId, {
      likeCount: post.likeCount - 1,
    }).populate("user");

    return res.status(200).send({ data: newPost._doc });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.toString() });
  }
};
