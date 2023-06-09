import _ from "lodash";

import ACTIONS from "../actions/actionTypes";

const initialState = {
    posts: {},
    post: {},
    loading: false,
    errorCode: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.FETCH_POSTS:
            return {
                ...state,
                posts: { ..._.mapKeys(action.payload, "_id") },
                loading: false,
            };

        case ACTIONS.FETCH_POST:
            return {
                ...state,
                post: action.payload,
                loading: false,
                errorCode: null,
            };

        case ACTIONS.CREATE_POST:
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [action.payload._id]: action.payload,
                },
            };

        case ACTIONS.EDIT_POST:
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [action.payload._id]: action.payload,
                },
            };

        case ACTIONS.DELETE_POST:
            return {
                ...state,
                posts: _.omit(state.posts, action.payload),
            };

        case ACTIONS.SUBMIT_COMMENT:
            // console.log(action)
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: [action.payload, ...state.post.comments],
                },
            };

        case ACTIONS.SET_ERROR:
            return {
                ...state,
                loading: false,
                errorCode: action.payload,
            };

        case ACTIONS.LOADING_DATA:
            return {
                ...state,
                loading: true,
            };

        default:
            return state;
    }
};
