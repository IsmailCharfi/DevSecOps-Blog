import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signup, authenticate } from "../redux/actions";
import history from "../history";
import { APP_TITLE, SIGNUP_TITLE } from "../utilities/Constants";
import { isBlank, isEmptyObj } from "../utilities/dataValidation";
import "../styles/Signup.css";

const Signup = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});

    // page title
    useEffect(() => {
        document.title = `Join Our Blog · ${APP_TITLE}`;
    }, []);

    useEffect(() => {
        if (props.authenticated) history.push("/");
        else {
            let token = localStorage.getItem("token");
            if (token) props.authenticate(token);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.authenticated]);

    useEffect(() => {
        if (props.ui.errors) setErrors(props.ui.errors);
    }, [props.ui.errors]);

    function Register(event) {
        event.preventDefault();
        const data = {
            email,
            username,
            password
        };

        let credErrors = {};

        if (isBlank(data.email)) credErrors.email = "Email can't be blank!";
        if (isBlank(data.username)) credErrors.username = "Username can't be blank!";
        if (isBlank(data.password))
            credErrors.password = "Password can't be blank!";

        if (isEmptyObj(credErrors)) {
            props.signup(data);
            setErrors({});
        } else setErrors(credErrors);
    }

    function renderMessage() {
        if (errors.error) {
            return (
                <p className="text-center error-message mb-2 mt-0">
                    {errors.error}
                </p>
            );
        } else return null;
    }

    return (
        <div className="row justify-centent-center align-items-center">
            {props.ui.loading && <p>loading...</p>}
            {!props.ui.loading && (
                <div className="signup-form-container col-10 col-sm-4 ml-auto mr-auto">
                    <div className="text-center">
                        <h2>{SIGNUP_TITLE}</h2>
                    </div>
                    <form
                        className="row justify-content-center mt-4"
                        onSubmit={Register}
                    >
                        <div className="col">
                            {renderMessage()}
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter email"
                                    autoComplete="on"
                                    value={email}
                                    onChange={(event) => {
                                        event.preventDefault();
                                        setEmail(event.target.value);
                                    }}
                                />
                                {errors.email ? (
                                    <small className="error-message">
                                        {errors.email}
                                    </small>
                                ) : null}
                            </div>

                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(event) => {
                                        event.preventDefault();
                                        setUsername(event.target.value);
                                    }}
                                />
                                {errors.username ? (
                                    <small className="error-message">
                                        {errors.username}
                                    </small>
                                ) : null}
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(event) => {
                                        event.preventDefault();
                                        setPassword(event.target.value);
                                    }}
                                />
                                {errors.password ? (
                                    <small className="error-message">
                                        {errors.password}
                                    </small>
                                ) : null}
                            </div>
                            <div className="signup-form button form-group row justify-content-center">
                                <button type="submit" className="btn">
                                    Create account
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="text-center">
                        Already have an account ?{" "}
                        <Link to="/login">Login here</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        authenticated: state.user.authenticated,
        ui: state.ui,
    };
};

export default connect(mapStateToProps, { signup, authenticate })(Signup);
