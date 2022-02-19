import { createStore, combineReducers, applyMiddleware } from "redux";
import { userProfileReducer } from "./reducers/userReducers";
import thunk from "redux-thunk";
import { userNoteReducer } from "./reducers/noteReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const reducer = combineReducers({
    user: userProfileReducer,
    notes: userNoteReducer,
});

const initialState = {
    user: { profile: null },
    notes: { notes: null },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    // applyMiddleware(...middleware)
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
