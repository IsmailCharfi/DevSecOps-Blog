import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LikeButton from "./LikeButton";
import PostDelete from "./PostDelete";
import UserTile from "./UserTile";
import "../../styles/Posts/Post.css";
const Post = (props) => {
    dayjs.extend(relativeTime);

    const { title, bodyMeta, createdAt, user, likeCount, commentCount } =
        props.post;

    const {
        authenticated,
        credentials: { _id },
    } = props.user;

    function renderAdmin() {
        return (
            <div className="menu">
                <div className="dropleft">
                    <div className="dropdown-toggle" data-toggle="dropdown">
                        <i className="fas fa-ellipsis-v"></i>
                    </div>

                    <div className="dropdown-menu">
                        <Link
                            className="dropdown-item"
                            to={`/posts/edit/${props.post._id}`}
                        >
                            Edit
                        </Link>
                        <div className="dropdown-item">
                            <PostDelete id={props.post._id} title={title} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            {authenticated && user._id === _id && renderAdmin()}
            <div className="card-body mr-1">
                <Link to={`/posts/${props.post._id}`}>
                    <h5 className="card-title">{title}</h5>
                </Link>
                <p className="card-text">{bodyMeta}</p>
                <div className="row meta-data align-items-center">
                    <div className="col-12 col-sm-6">
                        <UserTile user={user} createdAt={createdAt} />
                    </div>
                    <div className="col-12 col-sm-6">
                        <span>
                            <LikeButton
                                postId={props.post._id}
                                fetchAll={true}
                            />
                            {likeCount} Likes
                        </span>
                        <span className="ml-4">
                            <i className="far fa-comment"></i> {commentCount}{" "}
                            Comments
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return { user: state.user };
};
export default connect(mapStateToProps, {})(Post);
