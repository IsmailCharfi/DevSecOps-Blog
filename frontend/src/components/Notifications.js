import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { markNotificationRead } from "../redux/actions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "../styles/notifications.css";

const Notifications = ({ notifications, markNotificationRead }) => {
    dayjs.extend(relativeTime);

    const [open, setOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState([]);

    // updating unread notifications
    useEffect(() => {
        let unreadNotifications = notifications.filter(
            (noti) => noti.read === false
        );
        setUnreadNotifications(unreadNotifications);
    }, [notifications]);

    // marking read all unread notifications
    useEffect(() => {
        if (open && unreadNotifications.length > 0) {
            let ids = unreadNotifications.map((noti) => noti._id);
            markNotificationRead(ids);

            setUnreadNotifications([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const renderNotifications = () => {
        if (notifications && notifications.length > 0) {
            return notifications.map((noti) => {
                const read = noti.read ? "read" : "unread";
                const verb = noti.type === "like" ? "liked" : "commented on";
                const icon =
                    noti.type === "like" ? "fas fa-heart" : "fas fa-comment";
                const iconColor = noti.type === "like" ? "red" : "white";
                const time = dayjs(noti.createdAt).fromNow();
                const user = noti.sender;

                return (
                    <Link
                        key={noti.notificationId}
                        to={`/posts/${noti.post._id}`}
                    >
                        <div className="custom-dropdown-item" read={read}>
                            <i
                                style={{ color: iconColor }}
                                className={icon}
                            ></i>
                            <strong>{user.username}</strong> {verb} your blog{" "}
                            {time}
                        </div>
                    </Link>
                );
            });
        } else {
            return (
                <div className="custom-dropdown-item">
                    You don't have any notifications currently
                </div>
            );
        }
    };

    return (
        <li
            className="nav-item notifications custom-dropdown"
            open={open}
            onClick={() => setOpen((prev) => !prev)}
        >
            <span className="custom-tooltip" data-text="Your notifications">
                <div className="text-light nav-link">
                    <i className="far fa-bell"></i>
                    {unreadNotifications.length > 0 && (
                        <span className="badge rounded-pill badge-notification bg-danger">
                            {unreadNotifications.length}
                        </span>
                    )}
                </div>
            </span>
            <div className="custom-dropdown-menu">{renderNotifications()}</div>
        </li>
    );
};

const mapStateToProps = (state) => {
    return {
        notifications: state.user.notifications,
    };
};
export default connect(mapStateToProps, { markNotificationRead })(
    Notifications
);
