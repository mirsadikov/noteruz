import {
    USER_LOGIN_ERROR,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOG_OUT,
    USER_PROFILE_ERROR,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_REGISTER_ERROR,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
} from "../reducers/constants";

export const getUserProfile = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_PROFILE_REQUEST,
        });

        const res = await fetch(`/api/user/profile`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        dispatch({
            type: USER_PROFILE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_PROFILE_ERROR,
            payload: error.message,
        });
    }
};

export const loginUser = (email, password) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        const res = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: { email, password } }),
        });
        const user = await res.json();
        if (!res.ok) throw new Error(user.message);

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: user,
        });
    } catch (error) {
        dispatch({
            type: USER_LOGIN_ERROR,
            payload: error.message,
        });
    }
};
export const registerUser = (email, password) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST,
        });

        const res = await fetch("/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: { email, password } }),
        });
        const user = await res.json();
        if (!res.ok) throw new Error(user.message);

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: user,
        });
    } catch (error) {
        console.log(error.message);
        dispatch({
            type: USER_REGISTER_ERROR,
            payload: error.message,
        });
    }
};
export const logOut = () => async (dispatch) => {
    await fetch("/api/user/logout");

    dispatch({
        type: USER_LOG_OUT,
    });
};
