import ACTIONS from "../actions/actionTypes";

let initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: [],
    tempUser: {},
    errorCode: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.LOGOUT:
            return initialState;

        case ACTIONS.SET_USER:
            return {
                ...state,
                authenticated: true,
                ...action.payload,
                credentials: { ...action.payload },
                loading: false,
                errorCode: null,
            };

        case ACTIONS.SET_TEMP_USER:
            return {
                ...state,
                tempUser: action.payload,
                loading: false,
                errorCode: null,
            };

        case ACTIONS.MARK_NOTIFICATION_READ:
            // marking notifications read
            // let markedNotifications = state.notifications.filter(noti => !noti.read);
            state.notifications.forEach((noti) => (noti.read = true));

            return {
                ...state,
            };

        case ACTIONS.LOADING_USER:
            return { ...state, loading: true };

        case ACTIONS.SET_ERROR:
            return { ...state, errorCode: action.payload };

        default:
            return state;
    }
};
