import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import auth from "./reducers/auth";
 
const reducer = combineReducers({
    auth,
});
 
const store = configureStore({
    reducer,
});
 
export default store;