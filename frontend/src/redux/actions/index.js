import jwtDecode from "jwt-decode";
import { fetcher } from "../../api/RestApi";
import ACTIONS from "./actionTypes";
import history from "../../history";

export const signup = (data) => {
    return (dispatch) => {
        dispatch({ type: ACTIONS.LOADING_UI });

        fetcher
            .post("/users/signup", data)
            .then((res) => {
                localStorage.setItem("token", res.token);
                dispatch(fetchUserData());
                dispatch({ type: ACTIONS.CLEAR_ERROR });
                history.push("/");
            })
            .catch((error) => {
                dispatch({
                    type: ACTIONS.SET_ERROR,
                    payload: error.response.data,
                });
            });
    };
};

export const login = (data) => {
    return (dispatch) => {
        dispatch({ type: ACTIONS.LOADING_UI });

        fetcher
            .post(`/users/login`, data)
            .then((res) => {
                localStorage.setItem("token", res.token);
                dispatch(fetchUserData());
                dispatch({ type: ACTIONS.CLEAR_ERROR });
            })
            .catch((error) => {
                dispatch({
                    type: ACTIONS.SET_ERROR,
                    payload: error.response.data,
                });
            });
    };
};

export const authenticate = (token) => {
    return (dispatch) => {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
            dispatch(logout());
        } else {
            localStorage.setItem("token", token);
            dispatch(fetchUserData());
        }
    };
};

export const logout = () => {
    return (dispatch) => {
        localStorage.removeItem("token");
        dispatch({ type: ACTIONS.LOGOUT });
    };
};

export const fetchUserData = () => {
    return (dispatch) => {
        dispatch({ type: ACTIONS.LOADING_USER });

        fetcher
            .get("/users")
            .then((res) => {
                dispatch({
                    type: ACTIONS.SET_USER,
                    payload: res.data,
                });
                dispatch({ type: ACTIONS.CLEAR_ERROR });
            })
            .catch((error) => {
                dispatch({
                    type: ACTIONS.LOGOUT,
                });
            });
    };
};

export const uploadImage = (formData) => {
    return (dispatch) => {
        dispatch({ type: ACTIONS.LOADING_USER });

        fetcher
            .post("/users/upload", formData)
            .then(() => {
                dispatch(fetchUserData());
            })
            .catch((err) => console.error(err));
    };
};

export const editUserDetails = (data) => {
    return (dispatch) => {
        dispatch({ type: ACTIONS.LOADING_USER });

        fetcher
            .post("/users", data)
            .then(() => {
                dispatch(fetchUserData());
            })
            .catch((err) => console.error(err));
    };
};

export const markNotificationRead = (ids) => {
    return (dispatch) => {
        fetcher
            .post("/users/notification", ids)
            .then(() => {
                dispatch({ type: ACTIONS.MARK_NOTIFICATION_READ });
            })
            .catch((err) => console.error(err));
    };
};

export const fetchUser = (id) => {
    return (dispatch) => {
        dispatch({ type: ACTIONS.LOADING_USER });
        fetcher
            .get(`/users/${id}`)
            .then((res) => {
                dispatch({ type: ACTIONS.SET_TEMP_USER, payload: res.data });
            })
            .catch((error) => {
                dispatch({
                    type: ACTIONS.SET_ERROR,
                    payload: error.response.status,
                });
            });
    };
};

export const fetchPosts = () => {
    return (dispatch) => {
        dispatch({ type: ACTIONS.LOADING_DATA });

        fetcher
            .get("/posts")
            .then((res) => {
                dispatch({ type: ACTIONS.FETCH_POSTS, payload: res.data });
            })
            .catch((err) => {
                console.log(err);
                dispatch({ type: ACTIONS.FETCH_POSTS, payload: [] });
            });
    };
};

export const likePost = (postId, fetchall) => {
    return (dispatch) => {
        fetcher
            .post(`/posts/${postId}/like`)
            .then(() => dispatch(fetchUserData()))
            .then(() => {
                if (fetchall) {
                    dispatch(fetchPosts());
                } else {
                    dispatch(fetchPost(postId));
                }
            })
            .catch((err) => console.log(err));
    };
};

export const unlikePost = (postId, fetchall) => {
    return (dispatch) => {
        fetcher
            .post(`/posts/${postId}/unlike`)
            .then(() => dispatch(fetchUserData()))
            .then(() => {
                if (fetchall) {
                    dispatch(fetchPosts());
                } else {
                    dispatch(fetchPost(postId));
                }
            })
            .catch((err) => console.log(err));
    };
};

export const fetchPost = (id) => {
    return (dispatch) => {
        dispatch({ type: ACTIONS.LOADING_DATA });

        fetcher
            .get(`/posts/${id}`)
            .then((res) => {
                dispatch({ type: ACTIONS.FETCH_POST, payload: res.data });
                dispatch({ type: ACTIONS.CLEAR_ERROR });
            })
            .catch((error) => {
                dispatch({
                    type: ACTIONS.SET_ERROR,
                    payload: error.response.status,
                });
            });
    };
};

export const createPost = (data) => {
    return (dispatch) => {
        fetcher
            .post("/posts", data)
            .then((response) => {
                dispatch({ type: ACTIONS.CREATE_POST, payload: response.data });
                dispatch({
                    type: ACTIONS.CLEAR_ERROR,
                });
                history.push("/");
            })
            .catch((err) => {
                console.log(err);
                dispatch({
                    type: ACTIONS.SET_ERROR,
                    payload: err.response.data,
                });
            });
    };
};

export const uploadPostImage = (formData, postId) => {
    return (dispatch) => {
        fetcher
            .post(`/posts/${postId}/upload`, formData)
            .then(() => {
                dispatch(fetchPost(postId));
            })
            .catch((err) => console.error(err));
    };
};

export const editPost = (id, data) => {
    return (dispatch) => {
        fetcher
            .put(`/posts/${id}`, data)
            .then((response) => {
                dispatch({ type: ACTIONS.EDIT_POST, payload: response.data });
                history.push("/");
            })
            .catch((error) => {
                console.log(error);
            });
    };
};

export const deletePost = (id) => {
    return (dispatch) => {
        fetcher
            .delete(`/posts/${id}`)
            .then(() => {
                dispatch({ type: ACTIONS.DELETE_POST, payload: id });
            })
            .catch((error) => {
                console.log(error);
            });
    };
};

export const submitComment = (id, data) => {
    return (dispatch) => {
        fetcher
            .post(`/posts/${id}/comment`, data)
            .then((res) => {
                dispatch({ type: ACTIONS.SUBMIT_COMMENT, payload: res.data });
            })
            .catch((error) => {
                console.log(error);
            });
    };
};
