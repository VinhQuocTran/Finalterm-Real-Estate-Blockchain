import { createSlice } from "@reduxjs/toolkit";

const userPropertiesSlice = createSlice({
  name: 'user',
  initialState: {
    userProperties: [],
    loading: false,
    error: false
  },
  reducers: {
    fetchUserProperties: (state) => {
      state.loading = true;
    },
    fetchUserPropertiesSuccess: (state, action) => {
      state.userProperties = action.payload;
      state.loading = false;
    },
    fetchUserPropertiesFailure: (state) => {
      state.loading = true;
      state.error = true;
    },
    updateUserProperties: (state, action) => {
        state.userProperties = state.userProperties.push(action.payload);
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = userPropertiesSlice.actions;
export default userPropertiesSlice.reducer;