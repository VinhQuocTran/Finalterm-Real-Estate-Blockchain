import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    themeColor: 'light'
  },
  reducers: {
    setDarkTheme: (state) => {
        state.themeColor = 'dark';
    },
    setLightTheme: (state) => {
        state.themeColor = 'light';
    }
  }
});

export const { setDarkTheme, setLightTheme } = themeSlice.actions;
export default themeSlice.reducer;