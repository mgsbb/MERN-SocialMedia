import {
    SIGN_UP,
    SIGN_IN,
    LOGOUT,
    DELETE_USER,
    UPDATE_USER,
    GET_USER,
    GET_USERS,
} from '../constants/actionTypes';

// ============================================================================================

const authReducer = (
    authState = { authData: null, userDetails: null, users: [] },
    action: any,
) => {
    switch (action.type) {
        case SIGN_UP:
        case SIGN_IN:
            localStorage.setItem('profile', JSON.stringify(action.payload));
            return { ...authState, authData: action.payload };

        case LOGOUT:
            localStorage.removeItem('profile');
            return { ...authState, authData: null };

        case DELETE_USER:
            localStorage.removeItem('profile');
            return { ...authState, deleteUser: action.payload };

        case UPDATE_USER:
            localStorage.removeItem('profile');
            localStorage.setItem('profile', JSON.stringify(action.payload));
            return { ...authState, userDetails: action.payload };

        case GET_USER:
            return { ...authState, userDetails: action.payload };

        case GET_USERS:
            return { ...authState, users: action.payload };

        default:
            return authState;
    }
};

// ============================================================================================

export default authReducer;
