import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MarkdownRenderer from "../MarkdownRenderer";
import "../../styles/Posts/userTile.css";
import { BASE_URL } from "../../utilities/Constants";

const UserTile = ({ user, createdAt, body }) => {
    dayjs.extend(relativeTime);

    return (
        <div className="row user-tile align-items-center">
            <div className="col-12 col-sm-10">
                <div className="media">
                    <div className="media-left mr-2">
                        <img
                            className="media-object"
                            style={{objectFit: "scale-down"}}
                            src={BASE_URL + user?.imageUrl}
                            alt={`${user?.username}`}
                        />
                    </div>
                    <div className="media-body">
                        <p className="media-heading mb-0">
                            <Link to={`/user/${user?._id}`}>{user?.username}</Link>
                        </p>
                        <small>{dayjs(createdAt).fromNow()}</small>

                        {/* text */}
                        {body && <MarkdownRenderer content={body} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTile;
