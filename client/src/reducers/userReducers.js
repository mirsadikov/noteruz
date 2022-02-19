import {
    USER_PROFILE_SUCCESS,
    USER_PROFILE_REQUEST,
    USER_PROFILE_ERROR,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_ERROR,
    USER_LOG_OUT,
    USER_REGISTER_ERROR,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
} from "./constants";

export const userProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_PROFILE_REQUEST:
            return { ...state, loading: true };
        case USER_PROFILE_SUCCESS:
            return { ...action.payload, loading: false };
        case USER_PROFILE_ERROR:
            return { ...state, loading: false, error: action.payload };
        // LOGIN
        case USER_LOGIN_REQUEST:
            return { ...state, loading: true, error: null, logging: true };
        case USER_LOGIN_SUCCESS:
            return {
                ...action.payload,
                loading: false,
                logging: true,
            };
        case USER_LOGIN_ERROR:
            return { loading: false, loginError: action.payload };
        // REGISTER
        case USER_REGISTER_REQUEST:
            return { ...state, loading: true, error: null, logging: true };
        case USER_REGISTER_SUCCESS:
            return {
                ...action.payload,
                loading: false,
                logging: true,
            };
        case USER_REGISTER_ERROR:
            return { loading: false, registerError: action.payload };
        case USER_LOG_OUT:
            return {};
        default:
            return state;
    }
};

// export const userLoginReducer = (state = {}, action) => {
//     switch (action.type) {
//         default:
//             return state;
//     }
// };
