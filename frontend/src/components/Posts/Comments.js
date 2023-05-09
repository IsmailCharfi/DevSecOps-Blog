import React from "react";
import "../../styles/Posts/comments.css";
import UserTile from "./UserTile";

const Comments = ({ comments }) => {
    return (
        <div className="comments">
            {comments && comments.length > 0
                ? comments.map((comment, index) => {
                      const {
                          user,
                          body,
                          createdAt,
                      } = comment;

                      return (
                          <div key={index}>
                              <UserTile
                                  user={user}
                                  body={body}
                                  createdAt={createdAt}
                              />
                          </div>
                      );
                  })
                : null}
        </div>
    );
};

export default Comments;
