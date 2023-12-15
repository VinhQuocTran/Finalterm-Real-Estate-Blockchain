import { createSlice } from "@reduxjs/toolkit";

const userPropertiesSlice = createSlice({
  name: 'userProperties',
  initialState: {
    userProperties: [],
    loading: false,
    error: false
  },
  reducers: {
    fetchUserPropertiesStart: (state) => {
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
      state.userProperties.unshift(action.payload);
    }
  }
});

export const { fetchUserPropertiesStart, fetchUserPropertiesSuccess, fetchUserPropertiesFailure, updateUserProperties } = userPropertiesSlice.actions;
export default userPropertiesSlice.reducer;