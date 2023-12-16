import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import userPropertiesReducer from "./userPropertiesSlice";

const rootReducer = {
    user: userReducer,
    userProperties: userPropertiesReducer,
};

export const store = configureStore({
    reducer: rootReducer,
});