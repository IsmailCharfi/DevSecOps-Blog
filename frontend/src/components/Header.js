import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../redux/actions";
import history from "../history";
import Notifications from "./Notifications";
import { APP_TITLE, BASE_URL } from "../utilities/Constants";
import "../styles/Header.css";

const Header = (props) => {
    function Logout(event) {
        event.preventDefault();
        props.logout();

        // redirect to login page
        history.push("/login");
    }

    function renderUserLinks() {
        return (
            <ul className="navbar-nav my-account">
                <Notifications />

                <li className="nav-item d-none d-sm-block">
                    <Link to="/posts/new">
                        <span
                            className="custom-tooltip"
                            data-text="Create blog"
                        >
                            <button className="nav-link">
                                <i className="fas fa-plus"></i>
                            </button>
                        </span>
                    </Link>
                </li>

                {/* <!-- Dropdown --> */}
                <li className="nav-item dropdown">
                    <div
                        className="nav-link dropdown-toggle"
                        id="navbardrop"
                        data-toggle="dropdown"
                    >
                        <img
                            className="rounded-circle"
                            style={{ objectFit: "scale-down" }}
                            src={BASE_URL + props.user.credentials.imageUrl}
                            alt="profile"
                        />
                    </div>

                    <div className="dropdown-menu">
                        <Link
                            className="dropdown-item"
                            to={`/user/${props.user.credentials._id}`}
                        >
                            Profile
                        </Link>
                        <Link
                            className="dropdown-item d-block d-sm-none"
                            to={`/user/${props.user.credentials._id}`}
                        >
                            Create Post
                        </Link>
                        <Link className="dropdown-item" to="" onClick={Logout}>
                            Logout
                        </Link>
                    </div>
                </li>
            </ul>
        );
    }

    function renderGuestLinks() {
        return (
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/login">
                        <button className="btn">Login</button>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/signup">
                        <button className="btn">Signup</button>
                    </Link>
                </li>
            </ul>
        );
    }

    return (
        <nav className="navbar navbar-expand-sm">
            <Link className="navbar-brand" to="/">
                <h2>{APP_TITLE}</h2>
            </Link>

            {/* Toggler/collapsibe Button */}
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#myNavbar"
            >
                <i className="fas fa-bars"></i>
            </button>

            {/* Nav Links */}
            <div className="collapse navbar-collapse" id="myNavbar">
                {props.user.authenticated
                    ? renderUserLinks()
                    : renderGuestLinks()}
            </div>
        </nav>
    );
};

const mapStateToProps = (state) => {
    return { user: state.user };
};
export default connect(mapStateToProps, { logout })(Header);
