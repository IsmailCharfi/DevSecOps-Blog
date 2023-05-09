import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "../../styles/profile.css";
import { BASE_URL } from "../../utilities/Constants";

const StaticProfile = ({ profile }) => {
    dayjs.extend(relativeTime);

    const { imageUrl, username, bio, website, createdAt, location } = profile;

    return (
        <div className="profile">
            <div className="row profile-panel justify-content-center">
                <div className="col-12 ml-auto mr-auto">
                    <div className="text-center">
                        <img
                            className="rounded-circle"
                            src={BASE_URL +  imageUrl}
                            alt={`${username}`}
                        />
                    </div>

                    <div className="row justify-centent-center mt-2">
                        <div className="col-12 mb-2">
                            <h4>@{username}</h4>
                        </div>
                        {bio && (
                            <div className="col-12">
                                <p>{bio}</p>
                            </div>
                        )}

                        {location && (
                            <div className="col-12">
                                <p className="text-small">
                                    <i className="fas fa-map-marker-alt"></i>{" "}
                                    {location}
                                </p>
                            </div>
                        )}
                        {website && (
                            <div className="col-12">
                                <p className="text-small">
                                    <i className="fas fa-link"></i>{" "}
                                    <a
                                        href={website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {website}
                                    </a>
                                </p>
                            </div>
                        )}
                        <div className="col-12">
                            <p className="text-small">
                                <i className="fas fa-calendar-alt"></i> Joined{" "}
                                {dayjs(createdAt).fromNow()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaticProfile;
