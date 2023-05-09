const app = require("express");
const auth = require("../../utils/authMiddleware");
const {
    getAllPosts,
    createOnePost,
    getOnePost,
    updateOnePost,
    deleteOnePost,
    commentOnPost,
    likeAPost,
    unlikeAPost,
} = require("./posts.controllers");

const Router = app.Router();

Router.route("/")
    .get(getAllPosts)
    .post(auth, createOnePost);

Router.route("/:postId")
    .get(getOnePost)
    .put(auth, updateOnePost)
    .delete(auth, deleteOnePost);

Router.route("/:postId/comment").post(auth, commentOnPost);

Router.route("/:postId/like").post(auth, likeAPost);

Router.route("/:postId/unlike").post(auth, unlikeAPost);

module.exports = Router;
