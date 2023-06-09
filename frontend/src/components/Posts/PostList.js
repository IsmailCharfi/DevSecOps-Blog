import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchPosts, login, authenticate } from "../../redux/actions";
import CardSkeleton from "../Skeletons/CardSkeleton";
import Post from "./Post";

const PostList = (props) => {
    useEffect(() => {
        props.fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { posts, loading } = props.data;

    function renderPosts() {
        const postsValues = Object.values(posts);

        if (postsValues.length) {
            return postsValues.map((post) => {
                return <Post key={post._id} post={post} />;
            });
        } else {
            return <h2>No posts yet!</h2>;
        }
    }

    return (
        <div>
            {loading && <CardSkeleton />}
            {!loading && renderPosts()}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        data: state.data,
    };
};
export default connect(mapStateToProps, { fetchPosts, login, authenticate })(
    PostList
);
