import React from "react";
import { connect } from "react-redux";
import { likePost, unlikePost } from "../../redux/actions";
import history from "../../history";
import "../../styles/Posts/likeButton.css";

const LikeButton = (props) => {
    const {
        authenticated,
        likes,
        credentials: { _id },
    } = props.user;
    const { postId, fetchAll } = props;

    const like = () => {
        props.likePost(postId, fetchAll);
    };

    const unlike = () => {
        props.unlikePost(postId, fetchAll);
    };

    const renderLike = () => {
        if (
            likes.filter(
                (like) => like.user._id === _id && like.post._id === postId
            ).length > 0
        ) {
            return <i className="fas fa-heart" onClick={unlike}></i>;
        } else {
            return <i className="far fa-heart" onClick={like}></i>;
        }
    };

    return (
        <span className="like-button">
            {!authenticated && (
                <i
                    className="far fa-heart"
                    onClick={() => history.push("/login")}
                ></i>
            )}
            {authenticated && renderLike()}
        </span>
    );
};

const mapStateToProps = (state) => {
    return { user: state.user };
};
export default connect(mapStateToProps, { likePost, unlikePost })(LikeButton);
