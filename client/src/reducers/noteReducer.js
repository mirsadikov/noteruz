import {
    CREATE_NOTE_ERROR,
    CREATE_NOTE_REQUEST,
    CREATE_NOTE_SUCCESS,
    DELETE_NOTE_REQUEST,
    GET_NOTES_ERROR,
    GET_NOTES_REQUEST,
    GET_NOTES_SUCCESS,
    USER_LOG_OUT,
} from "./constants";

export const userNoteReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_NOTES_REQUEST:
            return { ...state, loading: true, noteLoading: true };
        case GET_NOTES_SUCCESS:
            return { ...action.payload, loading: false, ok: true };
        case GET_NOTES_ERROR:
            return { ...state, loading: false, error: action.payload };
        case CREATE_NOTE_REQUEST:
            return { ...state, noteLoading: true };
        case DELETE_NOTE_REQUEST: {
            return {
                ...state,
                noteLoading: true,
                notes: state.notes.filter(
                    (note) => note._id !== action.payload
                ),
            };
        }
        case CREATE_NOTE_SUCCESS:
            return {
                noteLoading: false,
                ok: true,
                notes: [...state.notes, action.payload.note],
            };
        case CREATE_NOTE_ERROR:
            return { ...state, noteLoading: false, error: action.payload };
        case USER_LOG_OUT:
            return {};
        default:
            return state;
    }
};
