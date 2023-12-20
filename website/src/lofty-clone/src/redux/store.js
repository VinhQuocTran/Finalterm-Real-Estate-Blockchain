import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import userPropertiesReducer from "./userPropertiesSlice";
import themeReducer from "./themeSlice";

const rootReducer = {
    user: userReducer,
    userProperties: userPropertiesReducer,
    theme: themeReducer
};

export const store = configureStore({
    reducer: rootReducer,
});