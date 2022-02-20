import {
    CREATE_NOTE_ERROR,
    CREATE_NOTE_REQUEST,
    CREATE_NOTE_SUCCESS,
    DELETE_NOTE_REQUEST,
    GET_NOTES_ERROR,
    GET_NOTES_REQUEST,
    GET_NOTES_SUCCESS,
} from "../reducers/constants";

export const getUserNotes = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: GET_NOTES_REQUEST,
        });

        const res = await fetch(`/api/user/notes`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        dispatch({
            type: GET_NOTES_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: GET_NOTES_ERROR,
            payload: error.message,
        });
    }
};

export const createNote = (title, desc) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CREATE_NOTE_REQUEST,
        });

        const res = await fetch("/api/note/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ note: { title, desc } }),
        });
        const note = await res.json();
        if (!res.ok) throw new Error(note.message);

        dispatch({
            type: CREATE_NOTE_SUCCESS,
            payload: note,
        });
    } catch (error) {
        dispatch({
            type: CREATE_NOTE_ERROR,
            payload: error.message,
        });
    }
};

export const noteDelete = (id) => async (dispatch) => {
    dispatch({
        type: DELETE_NOTE_REQUEST,
        payload: id,
    });
    const res = await fetch(`/api/note/delete/${id}`, {
        method: "DELETE",
    });
    const note = await res.json();
    if (!res.ok && !note.ok) alert(note.message);
    else {
        dispatch(getUserNotes());
    }
};
