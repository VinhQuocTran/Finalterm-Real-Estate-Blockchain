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
    },
    updateVerifiedPropertyStatus: (state, action) => {
      const index = state.userProperties.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.userProperties[index] = { ...state.userProperties[index], ...{isVerified: "0"} };
      }
    },
  }
});

export const { 
  fetchUserPropertiesStart, 
  fetchUserPropertiesSuccess, 
  fetchUserPropertiesFailure, 
  updateUserProperties, 
  updateVerifiedPropertyStatus 
} = userPropertiesSlice.actions;

export default userPropertiesSlice.reducer;